DocsApp
  .controller('DocsSearchCtrl', ['$scope', '$location', 'docsSearch', DocsSearchCtrl])
  .provider('docsSearch', DocsSearch)
  .directive('docsSearchInput', ['$compile', '$timeout', DocsSearchDirective]);

function DocsSearchCtrl($scope, $location, docsSearch) {
  function clearResults() {
    $scope.results = [];
    $scope.hasResults = false;
  }

  $scope.search = function(q) {
    var MIN_SEARCH_LENGTH = 2;
    if(q.length >= MIN_SEARCH_LENGTH) {
      docsSearch(q).then(function(hits) {
        $scope.hasResults = hits.length > 0;
        $scope.results = hits;
      });
    }
    else {
      clearResults();
    }
    if(!$scope.$$phase) $scope.$apply();
  };

  $scope.hideResults = function() {
    clearResults();
    $scope.q = '';
  };
};

function DocsSearch() {

  // This version of the service builds the index in the current thread,
  // which blocks rendering and other browser activities.
  // It should only be used where the browser does not support WebWorkers
  function localSearchFactory($http, $timeout, DOCS_PAGES) {

    console.log('Using Local Search Index');

    // Create the lunr index
    var index = lunr(function() {
      this.ref('path');
      this.field('titleWords', {boost: 50});
      this.field('members', { boost: 40});
      this.field('keywords', { boost : 20 });
    });

    // Delay building the index by loading the data asynchronously
    var indexReadyPromise = $http.get('js/search-data.json').then(function(response) {
      var searchData = response.data;
      // Delay building the index for 500ms to allow the page to render
      return $timeout(function() {
        // load the page data into the index
        angular.forEach(searchData, function(page) {
          index.add(page);
        });
      }, 500);
    });

    // The actual service is a function that takes a query string and
    // returns a promise to the search results
    // (In this case we just resolve the promise immediately as it is not
    // inherently an async process)
    return function(q) {
      return indexReadyPromise.then(function() {
        var hits = index.search(q);
        var results = [];
        angular.forEach(hits, function(hit) {
          results.push(DOCS_PAGES[hit.ref]);
        });
        return results;
      });
    };
  }
  localSearchFactory.$inject = ['$http', '$timeout', 'DOCS_PAGES'];

  // This version of the service builds the index in a WebWorker,
  // which does not block rendering and other browser activities.
  // It should only be used where the browser does support WebWorkers
  function webWorkerSearchFactory($q, $rootScope, DOCS_PAGES) {

    console.log('Using WebWorker Search Index')

    var searchIndex = $q.defer();
    var results;

    var worker = new Worker('search-worker.js');

    // The worker will send us a message in two situations:
    // - when the index has been built, ready to run a query
    // - when it has completed a search query and the results are available
    worker.onmessage = function(oEvent) {
      $rootScope.$apply(function() {

        switch(oEvent.data.e) {
        case 'index-ready':
          searchIndex.resolve();
          break;
        case 'query-ready':
          var pages = oEvent.data.d.map(function(path) {
            return DOCS_PAGES[path];
          });
          results.resolve(pages);
          break;
        }
      });
    };

    // The actual service is a function that takes a query string and
    // returns a promise to the search results
    return function(q) {

      // We only run the query once the index is ready
      return searchIndex.promise.then(function() {

        results = $q.defer();
        worker.postMessage({ q: q });
        return results.promise;
      });
    };
  }
  webWorkerSearchFactory.$inject = ['$q', '$rootScope', 'DOCS_PAGES'];

  return {
    $get: window.Worker ? webWorkerSearchFactory : localSearchFactory
  };
};

function DocsSearchDirective($compile, $timeout) {
  return {
    controller: ['$scope', '$location', 'docsSearch', DocsSearchCtrl],
    template: function (element, attr) {
      return "\
        <md-button\
            class='md-icon-button'\
            title='Search'\
            aria-label='Search'>\
          <md-icon\
              md-svg-src='img/icons/ic_search_24px.svg'>\
          </md-icon>\
        </md-button>\
        <div class='docs-search-input-wrap md-toolbar-child-item'>\
          <md-input-container md-no-float>\
            <label for='docs-search-input' class='md-visually-hidden'>Search</label>\
            <input\
              type='text'\
              ng-model='q'\
              ng-change='search(q)'\
              placeholder='Search'\
              id='docs-search-input'\
              tabindex='-1'>\
          </md-input-container>\
        </div>";
    },
    link: function(scope, element, attr) {
      var input = element.find('input'),
          button = element.find('button'),
          parent = element.parent();

      // need to allow hiding on blur
      // while also closing on second click of button
      input.on('blur', function($event) {
        parent.removeClass('md-active');
      });

      button.on('click', function($event) {
        console.log(parent);
        if (!parent.hasClass('md-active')) {
          parent.addClass('md-active');

          var timeout = $timeout(function() {
            input.focus();
          }, 250);
        }
        else {
          parent.removeClass('md-active');
        }
      });
      element.on('keydown', function($event) {
        if ($event.which === 27 && parent.hasClass('md-active')) {
          parent.removeClass('md-active');
          button.focus();
        }
      });
    }
  };
};
