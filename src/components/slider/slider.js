  /**
   * @ngdoc module
   * @name material.components.slider
   */
  angular.module('material.components.slider', [
    'material.core'
  ])
  .directive('mdSlider', SliderDirective)
  .directive('mdSliderContainer', SliderContainerDirective);

/**
 * @ngdoc directive
 * @name mdSliderContainer
 * @module material.components.slider
 * @restrict E
 * @description
 * The `<md-slider-container>` contains slider with two other elements.
 *
 *
 * @usage
 * <h4>Normal Mode</h4>
 * <hljs lang="html">
 * </hljs>
 */
function SliderContainerDirective() {
  return {
    compile: function (elem) {
      var slider = angular.element(elem[0].getElementsByTagName('md-slider'));

      if (!slider) {
        return;
      }

      var vertical = slider.attr('md-vertical');

      if (vertical !== undefined) {
        elem.attr('md-vertical', '');
      }

      if(!slider.attr('flex')) {
        slider.attr('flex', '');
      }

      return {
        post: function (scope, element, attr) {
          // We have to manually stop the $watch on ngDisabled because it exists
          // on the parent scope, and won't be automatically destroyed when
          // the component is destroyed.
          function setDisable(isDisabled) {
            element.children().attr('disabled', isDisabled);
            angular.element(element[0].getElementsByTagName('input')).attr('disabled', isDisabled);
          }

          var stopDisabledWatch = angular.noop;
          if (attr.disabled) {
            setDisable(true);
          }
          else if (attr.ngDisabled) {
            stopDisabledWatch = scope.$watch(attr.ngDisabled, function (isDisabled) {
              setDisable(isDisabled);
            });
          }

          scope.$on('$destroy', function () {
            stopDisabledWatch();
          });
        }
      }
    }
  }
}

/**
 * @ngdoc directive
 * @name mdSlider
 * @module material.components.slider
 * @restrict E
 * @description
 * The `<md-slider>` component allows the user to choose from a range of
 * values.
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the slider is in the accent color by default. The primary color palette may be used with
 * the `md-primary` class.
 *
 * It has two modes: 'normal' mode, where the user slides between a wide range
 * of values, and 'discrete' mode, where the user slides between only a few
 * select values.
 *
 * To enable discrete mode, add the `md-discrete` attribute to a slider,
 * and use the `step` attribute to change the distance between
 * values the user is allowed to pick.
 *
 * @usage
 * <h4>Normal Mode</h4>
 * <hljs lang="html">
 * <md-slider ng-model="myValue" min="5" max="500">
 * </md-slider>
 * </hljs>
 * <h4>Discrete Mode</h4>
 * <hljs lang="html">
 * <md-slider md-discrete ng-model="myDiscreteValue" step="10" min="10" max="130">
 * </md-slider>
 * </hljs>
 *
 * @param {boolean=} md-discrete Whether to enable discrete mode.
 * @param {number=} step The distance between values the user is allowed to pick. Default 1.
 * @param {number=} min The minimum value the user is allowed to pick. Default 0.
 * @param {number=} max The maximum value the user is allowed to pick. Default 100.
 */
function SliderDirective($$rAF, $window, $mdAria, $mdUtil, $mdConstant, $mdTheming, $mdGesture, $parse, $log, $compile,
                         $timeout, $animate) {
  return {
    scope: {},
    require: '?ngModel',
    template:
      '<div class="md-slider-wrapper">' +
        '<div class="md-slider-content">' +
          '<div class="md-track-container">' +
            '<div class="md-track"></div>' +
            '<div class="md-track md-track-fill"></div>' +
            '<div class="md-track-ticks"></div>' +
          '</div>' +
          '<div class="md-thumb-container">' +
            '<div class="md-thumb"></div>' +
            '<div class="md-focus-thumb"></div>' +
            '<div class="md-focus-ring"></div>' +
            '<div class="md-sign">' +
              '<span class="md-thumb-text"></span>' +
            '</div>' +
            '<div class="md-disabled-thumb"></div>' +
          '</div>' +
        '</div>' +
      '</div>',
    compile: compile
  };

  // **********************************************************
  // Private Methods
  // **********************************************************

  function compile (tElement) {
    var wrapper = angular.element(tElement[0].getElementsByClassName('md-slider-wrapper'));

    wrapper.attr({
      tabIndex: 0,
      role: 'slider'
    });

    $mdAria.expect(tElement, 'aria-label');

    return postLink;
  }

  function postLink(scope, element, attr, ngModelCtrl) {
    $mdTheming(element);
    ngModelCtrl = ngModelCtrl || {
      // Mock ngModelController if it doesn't exist to give us
      // the minimum functionality needed
      $setViewValue: function(val) {
        this.$viewValue = val;
        this.$viewChangeListeners.forEach(function(cb) { cb(); });
      },
      $parsers: [],
      $formatters: [],
      $viewChangeListeners: []
    };

    var container = angular.element($mdUtil.getClosest(element, 'md-slider-container', true));

    var isDisabledGetter = function () {
      return element[0].hasAttribute('disabled');
    };
    if (attr.ngDisabled) {
      isDisabledGetter = angular.bind(null, $parse(attr.ngDisabled), scope.$parent);
    }

    var thumb = angular.element(element[0].querySelector('.md-thumb'));
    var thumbText = angular.element(element[0].querySelector('.md-thumb-text'));
    var thumbContainer = thumb.parent();
    var trackContainer = angular.element(element[0].querySelector('.md-track-container'));
    var activeTrack = angular.element(element[0].querySelector('.md-track-fill'));
    var tickContainer = angular.element(element[0].querySelector('.md-track-ticks'));
    var wrapper = angular.element(element[0].getElementsByClassName('md-slider-wrapper'));
    var content = angular.element(element[0].getElementsByClassName('md-slider-content'));
    var throttledRefreshDimensions = $mdUtil.throttle(refreshSliderDimensions, 5000);

    // Default values, overridable by attrs
    angular.isDefined(attr.min) ? attr.$observe('min', updateMin) : updateMin(0);
    angular.isDefined(attr.max) ? attr.$observe('max', updateMax) : updateMax(100);
    angular.isDefined(attr.step)? attr.$observe('step', updateStep) : updateStep(1);
    var vertical = angular.isDefined(attr.mdVertical);
    var discrete = angular.isDefined(attr.mdDiscrete);

    // We have to manually stop the $watch on ngDisabled because it exists
    // on the parent scope, and won't be automatically destroyed when
    // the component is destroyed.
    var stopDisabledWatch = angular.noop;
    if (attr.ngDisabled) {
      stopDisabledWatch = scope.$parent.$watch(attr.ngDisabled, updateAriaDisabled);
    }

    $mdGesture.register(wrapper, 'drag', { horizontal: !vertical });

    scope.mouseActive = false;

    wrapper
      .on('keydown', keydownListener)
      .on('mousedown', mouseDownListener)
      .on('focus', focusListener)
      .on('blur', blurListener)
      .on('$md.pressdown', onPressDown)
      .on('$md.pressup', onPressUp)
      .on('$md.dragstart', onDragStart)
      .on('$md.drag', onDrag)
      .on('$md.dragend', onDragEnd);

    // On resize, recalculate the slider's dimensions and re-render
    function updateAll() {
      refreshSliderDimensions();
      ngModelRender();
    }
    setTimeout(updateAll, 0);

    var debouncedUpdateAll = $$rAF.throttle(updateAll);
    angular.element($window).on('resize', debouncedUpdateAll);

    scope.$on('$destroy', function() {
      angular.element($window).off('resize', debouncedUpdateAll);
      stopDisabledWatch();
    });

    ngModelCtrl.$render = ngModelRender;
    ngModelCtrl.$viewChangeListeners.push(ngModelRender);
    ngModelCtrl.$formatters.push(minMaxValidator);
    ngModelCtrl.$formatters.push(stepValidator);

    /**
     * Attributes
     */
    var min;
    var max;
    var step;
    function updateMin(value) {
      min = parseFloat(value);
      element.attr('aria-valuemin', value);
      updateAll();
    }
    function updateMax(value) {
      max = parseFloat(value);
      element.attr('aria-valuemax', value);
      updateAll();
    }
    function updateStep(value) {
      step = parseFloat(value);
    }
    function updateAriaDisabled(isDisabled) {
      element.attr('aria-disabled', !!isDisabled);
    }

    // Draw the ticks with canvas.
    // The alternative to drawing ticks with canvas is to draw one element for each tick,
    // which could quickly become a performance bottleneck.
    var tickCanvas, tickCtx;
    function redrawTicks() {
      if (!discrete || isDisabledGetter()) return;
      if ( angular.isUndefined(step) )         return;

      if ( step <= 0 ) {
        var msg = 'Slider step value must be greater than zero when in discrete mode';
        $log.error(msg);
        throw new Error(msg);
      }

      var numSteps = Math.floor( (max - min) / step );
      if (!tickCanvas) {
        tickCanvas = angular.element('<canvas style="position:absolute;">');
        tickContainer.append(tickCanvas);

        tickCtx = tickCanvas[0].getContext('2d');
      }

      var dimensions = getSliderDimensions();

      // If `dimensions` doesn't have height and width it might be the first attempt so we will refresh dimensions
      if (dimensions && !dimensions.height && !dimensions.width) {
        refreshSliderDimensions();
        dimensions = sliderDimensions;
      }

      tickCanvas[0].width = dimensions.width;
      tickCanvas[0].height = dimensions.height;

      var distance;
      for (var i = 0; i <= numSteps; i++) {
        var trackTicksStyle = $window.getComputedStyle(tickContainer[0]);
        tickCtx.fillStyle = trackTicksStyle.color || 'black';

        distance = Math.floor((vertical ? dimensions.height : dimensions.width) * (i / numSteps));

        tickCtx.fillRect(vertical ? 0 : distance - 1,
          vertical ? distance - 1 : 0,
          vertical ? dimensions.width : 2,
          vertical ? 2 : dimensions.height);
      }
    }

    function clearTicks() {
      if(tickCanvas && tickCtx) {
        var dimensions = getSliderDimensions();
        tickCtx.clearRect(0, 0, dimensions.width, dimensions.height);
      }
    }

    /**
     * Refreshing Dimensions
     */
    var sliderDimensions = {};
    refreshSliderDimensions();
    function refreshSliderDimensions() {
      sliderDimensions = trackContainer[0].getBoundingClientRect();
    }
    function getSliderDimensions() {
      throttledRefreshDimensions();
      return sliderDimensions;
    }

    /**
     * left/right/up/down arrow listener
     */
    function keydownListener(ev) {
      if(element[0].hasAttribute('disabled')) {
        return;
      }

      var changeAmount;
      if (vertical ? ev.keyCode === $mdConstant.KEY_CODE.DOWN_ARROW : ev.keyCode === $mdConstant.KEY_CODE.LEFT_ARROW) {
        changeAmount = -step;
      } else if (vertical ? ev.keyCode === $mdConstant.KEY_CODE.UP_ARROW : ev.keyCode === $mdConstant.KEY_CODE.RIGHT_ARROW) {
        changeAmount = step;
      }
      if (changeAmount) {
        if (ev.metaKey || ev.ctrlKey || ev.altKey) {
          changeAmount *= 4;
        }
        ev.preventDefault();
        ev.stopPropagation();
        scope.$evalAsync(function() {
          setModelValue(ngModelCtrl.$viewValue + changeAmount);
        });
      }
    }

    function mouseDownListener() {
      redrawTicks();

      scope.mouseActive = true;
      wrapper.removeClass('md-focused');

      $timeout(function() {
        scope.mouseActive = false;
      }, 100);
    }

    function focusListener() {
      if (scope.mouseActive === false) {
        wrapper.addClass('md-focused');
      }
    }

    function blurListener() {
      wrapper.removeClass('md-focused');
      element.removeClass('md-active');
      clearTicks();
    }

    /**
     * ngModel setters and validators
     */
    function setModelValue(value) {
      ngModelCtrl.$setViewValue( minMaxValidator(stepValidator(value)) );
    }
    function ngModelRender() {
      if (isNaN(ngModelCtrl.$viewValue)) {
        ngModelCtrl.$viewValue = ngModelCtrl.$modelValue;
      }

      ngModelCtrl.$viewValue = minMaxValidator(ngModelCtrl.$viewValue);

      var percent = (ngModelCtrl.$viewValue - min) / (max - min);
      scope.modelValue = ngModelCtrl.$viewValue;
      element.attr('aria-valuenow', ngModelCtrl.$viewValue);
      setSliderPercent(percent);
      thumbText.text( ngModelCtrl.$viewValue );
    }

    function minMaxValidator(value) {
      if (angular.isNumber(value)) {
        return Math.max(min, Math.min(max, value));
      }
    }
    function stepValidator(value) {
      if (angular.isNumber(value)) {
        var formattedValue = (Math.round((value - min) / step) * step + min);
        // Format to 6 digits after the decimal point.
        return (Math.round(formattedValue * 1000000) / 1000000);
      }
    }

    /**
     * @param percent 0-1
     */
    function setSliderPercent(percent) {
      var activeThumb = thumbContainer;
      var thumbPosition = (percent * 100) + '%';
      var trackSize = thumbPosition;

      activeThumb.css(vertical ? 'bottom' : 'left', thumbPosition);
      activeTrack.css(vertical ? 'height' : 'width', trackSize);

      element.toggleClass('md-min', percent === 0);
      element.toggleClass('md-max', percent === 1);
    }

    /**
     * Slide listeners
     */
    var isDragging = false;

    function onPressDown(ev) {
      if (isDisabledGetter()) return;

      element.addClass('md-active');
      element[0].focus();
      refreshSliderDimensions();

      var exactVal = percentToValue( positionToPercent( vertical ? ev.pointer.y : ev.pointer.x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      scope.$apply(function() {
        setModelValue( closestVal );
        setSliderPercent( valueToPercent(closestVal));
      });
    }
    function onPressUp(ev) {
      if (isDisabledGetter()) return;

      element.removeClass('md-dragging');

      var exactVal = percentToValue( positionToPercent( vertical ? ev.pointer.y : ev.pointer.x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      scope.$apply(function() {
        setModelValue(closestVal);
        ngModelRender();
      });
    }
    function onDragStart(ev) {
      if (isDisabledGetter()) return;
      isDragging = true;

      ev.stopPropagation();

      element.addClass('md-dragging');
      setSliderFromEvent(ev);
    }
    function onDrag(ev) {
      if (!isDragging) return;
      ev.stopPropagation();
      setSliderFromEvent(ev);
    }
    function onDragEnd(ev) {
      if (!isDragging) return;
      ev.stopPropagation();
      isDragging = false;
    }

    function setSliderFromEvent(ev) {
      // While panning discrete, update only the
      // visual positioning but not the model value.
      if ( discrete ) adjustThumbPosition( vertical ? ev.pointer.y : ev.pointer.x );
      else            doSlide( vertical ? ev.pointer.y : ev.pointer.x );
    }

    /**
     * Slide the UI by changing the model value
     * @param x
     */
    function doSlide( x ) {
      setModelValue( percentToValue( positionToPercent(x) ));
    }

    /**
     * Slide the UI without changing the model (while dragging/panning)
     * @param x
     */
    function adjustThumbPosition( x ) {
      var exactVal = percentToValue( positionToPercent( x ));
      var closestVal = minMaxValidator( stepValidator(exactVal) );
      setSliderPercent( positionToPercent(x) );
      thumbText.text( closestVal );
    }

    /**
     * Convert position on slider to percentage value of offset from beginning...
     * @param position
     * @returns {number}
     */
    function positionToPercent( position ) {
      var offset = vertical ? sliderDimensions.top : sliderDimensions.left;
      var size = vertical ? sliderDimensions.height : sliderDimensions.width;
      var calc = (position - offset) / size;

      return Math.max(0, Math.min(1, vertical ? 1 - calc : calc));
    }

    /**
     * Convert percentage offset on slide to equivalent model value
     * @param percent
     * @returns {*}
     */
    function percentToValue( percent ) {
      return (min + percent * (max - min));
    }

    function valueToPercent( val ) {
      return (val - min)/(max - min);
    }
  }
}
