angular
  .module('material.core')
  .service('$mdAria', AriaService);

/*
 * @ngInject
 */
function AriaService($$rAF, $log, $window) {

  return {
    expect: expect,
    expectAsync: expectAsync,
    expectWithText: expectWithText,
    validateAriaLabel: validateAriaLabel
  };

  /**
   * Validate aria-label value for input, fallback to placeholder value
   * Fallback to designated parent element if needed.
   */
  function validateAriaLabel( inputEl, parentEl ) {
    if (!inputEl) {
      var error = "$mdAria.validateAriaLabel() - undefined input element for node";
      return $log.warn(error, parentEl);
    }

    // Delay until digest is done to all data-bindings to update
    // and possible set aria-labels or placeholders
    $$rAF(function () {

      var label = ariaLabel(inputEl) || ariaLabel(inputEl, ariaLabel(parentEl));

      // If no aria-label specified, then look for placeHolder attribute value and inject as aria-label attribute value
      // If no placeholder, then  warn that the input or the parent element needs a plac

      if (!hasValue(label)) {
        label = ariaLabel(inputEl, placeHolder(inputEl) || placeHolder(parentEl));

        if (!hasValue(label)) {
          var msg = 'ARIA: Attribute "aria-label" is required for accessibility. ';
              msg = msg + 'Please specify an "aria-label" or a "placeholder" attribute ';
              msg = msg + 'on either the ' + parentEl[0].tagName + ' element ';
              msg = msg + 'or its nested ' + inputEl[0].tagName + ' element.';

          $log.warn(msg);
        }
      }

    });
  }

  /**
   * Check if expected attribute has been specified on the target element or child
   * @param element
   * @param attrName
   * @param {optional} defaultValue What to set the attr to if no value is found
   */
  function expect(element, attrName, defaultValue) {
    var node = angular.element(element[0] || element);

    // if node exists and neither it nor its children have the attribute
    if (!hasValue(attrValue(node, attrName)) && !childHasAttribute(node, attrName)) {

      if (hasValue(defaultValue)) {

        attrValue(node, attrName, defaultValue);

      } else {

        $log.warn('ARIA: Attribute "', attrName, '", required for accessibility, is missing on node:', node);
      }

    }
  }

  function expectAsync(element, attrName, defaultValueGetter) {
    // Problem: when retrieving the element's contents synchronously to find the label,
    // the text may not be defined yet in the case of a binding.
    // There is a higher chance that a binding will be defined if we wait one frame.
    $$rAF(function () {
      expect(element, attrName, defaultValueGetter());
    });
  }

  function expectWithText(element, attrName) {
    expectAsync(element, attrName, function () {
      return getText(element);
    });
  }

  function getText(element) {
    return element.text().trim();
  }

  function childHasAttribute(node, attrName) {
    var hasChildren = node[0].hasChildNodes(),
      hasAttr = false;

    function isHidden(el) {
      var style = el.currentStyle ? el.currentStyle : $window.getComputedStyle(el);
      return (style.display === 'none');
    }

    if (hasChildren) {
      var children = node[0].childNodes;
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.nodeType === 1 && child.hasAttribute(attrName)) {
          if (!isHidden(child)) {
            hasAttr = true;
          }
        }
      }
    }
    return hasAttr;
  }

  /**
   * Accessor to find the element 'placeholder'
   * attribute value
   */
  function placeHolder(element) {
    return attrValue(element, 'placeholder');
  }

  /**
   * Find element 'aria-label' attribute value
   */
  function ariaLabel(element, value) {
    return attrValue(element, 'aria-label', value);
  }

  /**
   * Accessor & mutator for element attr
   * Always returns current/updated attribute value
   */
  function attrValue(element, attrName, value) {
    if (!element)        return undefined;
    if (!attrName)        attrName = 'aria-label';

    // Mutate attribute value if valid
    if (hasValue(value))  element.attr(attrName, value.trim());

    return element.attr(attrName);
  }

  /**
   * Validator if the attribute value is not empty
   */
  function hasValue(source) {
    return angular.isString(source) && (source.trim().length > 0);
  }

}
