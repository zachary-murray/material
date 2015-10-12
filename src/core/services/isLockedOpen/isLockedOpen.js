angular.module('material.core')
  .directive('mdIsLockedOpen', IsLockedOpenDirective);

function IsLockedOpenDirective ($parse, $mdMedia, $animate, $log) {
  return {
    restrict: 'A',
    controller: angular.noop,
    link: function (scope, element, attr, ctrl) {
      /**
       * Toggle the DOM classes to indicate `locked`
       * @param backdrop Backdrop element to apply .md-locked-open class on
       */
      ctrl.updateIsLocked = function (backdrop) {
        $animate[ctrl.isLocked ? 'addClass' : 'removeClass'](element, 'md-locked-open');

        if (backdrop) {
          backdrop.toggleClass('md-locked-open', !!ctrl.isLocked);
        }
      };

      ctrl.isLocked = false;

      attr.$observe('mdIsLockedOpen', function (value) {
        ctrl.onChange(function (scope) {
          ctrl.isLocked = $parse(value)(scope, {
            $media: function (arg) {
              $log.warn("$media is deprecated for is-locked-open. Use $mdMedia instead.");
              return $mdMedia(arg);
            },
            $mdMedia: $mdMedia
          });

        });
      });
    }
  };
}