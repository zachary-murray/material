describe('mdIcon directive', function() {
  var el;
  var $scope;
  var $compile;
  var $mdIconProvider;

  beforeEach(module('material.core'));
  beforeEach(module('material.components.icon'));
  beforeEach(module('material.components.icon',function(_$mdIconProvider_){
     $mdIconProvider = _$mdIconProvider_;
   }));
   afterEach( function() {
     $mdIconProvider.defaultFontSet('material-icons');
   });


  describe('for font-icons:', function () {

    beforeEach( inject(function($rootScope, _$compile_){
        $scope = $rootScope;
        $compile = _$compile_;
    }));

    ddescribe('using font-icons with deprecated md-font-icon=""', function() {

      it('should render correct HTML with md-font-icon value as class', function() {
        el = make( '<md-icon md-font-icon="android"></md-icon>');
        expect(html(el)).toEqual('<span class="md-font android"></span>');
      });

      it('should transclude class specifiers', function() {
        el = make( '<md-icon md-font-icon="android" class="material-icons"></md-icon>');
        expect(html(el)).toEqual('<span class="md-font material-icons android"></span>');
      });

      it('should not render any inner content if the md-font-icon value is empty', function() {
        el = make( '<md-icon md-font-icon=""></md-icon>' );
        expect(html(el)).toEqual('<div class="md-icon"></div>');
      });

    });

    ddescribe('using font-icons with ligatures: md-font-set=""', function() {

      it('should render correct HTML with ligatures and dynamic size', function() {
        el = make( '<md-icon ng-class="fontSize">face</md-icon>');
        $scope.$apply("fontSize={ \'md-36\': true }");

        expect(html(el)).toEqual('<span class="material-icons md-36"><span>face</span></span>');
      });

      it('should render correct HTML with ligatures and static size', function() {
        el = make( '<md-icon class="md-48">face</md-icon>');
        expect(html(el)).toEqual('<span class="md-48 material-icons"><span>face</span></span>');
      });

      it('should render correctly using a md-font-set alias', function() {
        $mdIconProvider.fontSet('fa', 'fontawesome');

        el = make( '<md-icon md-font-set="fa">email</md-icon>');
        expect(html(el)).toEqual('<span class="fontawesome"><span>email</span></span>');
      });

      it('should render correctly using md-font-set value as class', function() {

        el = make( '<md-icon md-font-set="fontawesome">email</md-icon>');
        expect(html(el)).toEqual('<span class="fontawesome"><span>email</span></span>');
      });
    });

    describe('using font-icons with classnames', function() {

      it('should render with icon classname', function() {
        el = make( '<md-icon class="custom-cake"></md-icon>');
        expect(el.html()).toEqual('<span class="material-icons custom-cake" ng-transclude=""></span>');
      });

      it('should support clearing default fontset', function() {
        $mdIconProvider.defaultFontSet('');

        el = make( '<md-icon class="custom-cake"></md-icon>');
        expect(el.html()).toEqual('<span class="custom-cake" ng-transclude=""></span>');

        el = make( '<md-icon class="custom-cake">apple</md-icon>');
        expect(el.html()).toEqual('<span class="custom-cake" ng-transclude=""><span class="ng-scope">apple</span></span>');

      });

      it('should support clearing an invalid font alias', function() {

        el = make( '<md-icon md-font-set="none" class="custom-cake"></md-icon>');
        expect(el.html()).toEqual('<span class="none custom-cake" ng-transclude=""></span>');

        el = make( '<md-icon md-font-set="none" class="custom-cake">apple</md-icon>');
        expect(el.html()).toEqual('<span class="none custom-cake" ng-transclude=""><span class="ng-scope">apple</span></span>');

      });
    });


  });

  describe('for SVGs: ', function () {

    beforeEach(function() {
      var $q;

      module(function($provide) {
        $provide.value('$mdIcon', function $mdIconMock(id) {

              function getIcon(id) {
                switch(id) {
                  case 'android'      : return '<svg><g id="android"></g></svg>';
                  case 'cake'         : return '<svg><g id="cake"></g></svg>';
                  case 'android.svg'  : return '<svg><g id="android"></g></svg>';
                  case 'cake.svg'     : return '<svg><g id="cake"></g></svg>';
                  case 'image:android': return '';
                }
              }

            return $q(function(resolve){
               resolve(getIcon(id));
            });
          });
      });

      inject(function($rootScope, _$compile_, _$q_){
        $scope = $rootScope;
        $compile = _$compile_;
        $q = _$q_;
      });

    });

    describe('using md-svg-icon=""', function() {

      it('should update mdSvgIcon when attribute value changes', function() {
        $scope.iconName = 'android';
        el = make('<md-icon md-svg-icon="{{ iconName }}"></md-icon>');
        var iScope = el.isolateScope();
        expect(iScope.svgIcon).toEqual('android');
        $scope.iconName = 'cake';
        $scope.$digest();
        expect(iScope.svgIcon).toEqual('cake');
      });

      it('should not include a ng-transclude when using mdSvgIcon', function() {

        el = make('<md-icon md-svg-icon="image:android"></md-icon>');
        expect(el.html()).toEqual('');
      });


    });

    describe('using md-svg-src=""', function() {

      it('should update mdSvgSrc when attribute value changes', function() {
        $scope.url = 'android.svg';
        el = make('<md-icon md-svg-src="{{ url }}"></md-icon>');
        var iScope = el.isolateScope();
        expect(iScope.svgSrc).toEqual('android.svg');
        $scope.url = 'cake.svg';
        $scope.$digest();
        expect(iScope.svgSrc).toEqual('cake.svg');
      });

      it('should not include a ng-transclude when using mdSvgSrc', inject(function($templateCache) {
        $templateCache.put('img/android.svg', '');

        el = make('<md-icon md-svg-src="img/android.svg"></md-icon>');
        expect(el.html()).toEqual('');
      }));

    });

    describe('with ARIA support', function() {

      it('should apply aria-hidden="true" when parent has valid label', function() {
        el = make('<button aria-label="Android"><md-icon md-svg-icon="android"></md-icon></button>');
        expect(el.find('md-icon').attr('aria-hidden')).toEqual('true');

        el = make('<md-radio-button aria-label="avatar 2" role="radio"> '+
                    '<div class="md-container"></div> '+
                      '<div class="md-label"> '+
                      '<md-icon md-svg-icon="android"></md-icon> '+
                    '</div></md-radio-button>');

        expect(el.find('md-icon').attr('aria-hidden')).toEqual('true');
      });

      it('should apply aria-hidden="true" when parent has text content', function() {
        el = make('<button>Android <md-icon md-svg-icon="android"></md-icon></button>');
        expect(el.find('md-icon').attr('aria-hidden')).toEqual('true');
      });

      it('should apply aria-hidden="true" when aria-label is empty string', function() {
        el = make('<md-icon md-svg-icon="android" ></md-icon>');
        expect(el.attr('aria-label')).toEqual('android');
        expect(el.attr('aria-hidden')).toBeUndefined();
      });

      it('should apply use the aria-label value when set', function() {
        el = make('<md-icon md-svg-icon="android" aria-label="my android icon"></md-icon>');
        expect(el.attr('aria-label')).toEqual('my android icon');
      });

      it('should apply font-icon value to aria-label when aria-label not set', function() {
        el = make('<md-icon md-font-icon="android"></md-icon>');
        expect(el.attr('aria-label')).toEqual('android');
      });

      it('should apply svg-icon value to aria-label when aria-label not set', function() {
        el = make('<md-icon md-svg-icon="android"></md-icon>');
        expect(el.attr('aria-label')).toEqual('android');
      });

    });
  });



  // ****************************************************
  // Internal utility methods
  // ****************************************************

  function make(html) {
    var el;
    el = $compile(html)($scope);
    $scope.$digest();
    return el;
  }

  /**
   * Utility to remove extra attributes to the specs are easy to compare
   */
  function html(element, excludeAria) {
    var results = element[0].outerHTML
          .replace(/ng-transclude=\"\"|ng-scope|md-default-theme|ng-isolate-scope/gi,'')
          .replace(/md-font-set=\"[a-zA-Z0-9]*\"/g,'')
          .replace(/md-font-icon=\"[\{\}a-zA-Z0-9]*\"/g,'')
          .replace(/ng-class=\"[a-zA-Z]*\"/g,'');

    if ( !excludeAria ) {
      results = results
        .replace(/aria-label=\"[a-zA-Z]*\"/g,'')
        .replace(/role=\"[a-zA-Z]*\"/g,'');
    }

    return results
      .replace(/\s\s+/g,' ')
      .replace(/class=\"\"/g,'')
      .replace(/=\"\s+/g,'="')
      .replace(/\s+\>/g,'>')
      .replace(/\s+\"/g,'"');
  }

});
