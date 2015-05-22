var _ = require('lodash');

/**
 * @dgProcessor populateSearchData
 * @description
 * This processor translates docs information to a Javascript file containing
 * relavant information to execute a search.
 */
module.exports = function populateSearchData(log, moduleMap) {

  return {
    $runAfter: ['extractKeywordsProcessor', 'componentsGenerateProcessor'],
    $runBefore: ['rendering-docs'],
    $process: process
  };

  function process(docs) {
    var filteredDocs = _(docs).filter(onlyPagesWithSearchTerms).value();

    docs.push({
      docType: 'json-doc',
      id: 'search-data-json',
      template: 'json-doc.template.json',
      outputPath: 'js/search-data.json',
      data: mapDocsToSearchData(filteredDocs)
    });

    // Extract a list of basic page information for mapping paths to partials and for client side searching
    docs.push({
      docType: 'pages-data',
      id: 'pages-data',
      template: 'pages-data.template.js',
      outputPath: 'js/pages-data.js',
      pages: mapDocsToPageData(filteredDocs)
    });
  };
};

function onlyPagesWithSearchTerms(page) {
  return page.searchTerms;
};

function mapDocsToSearchData(docs) {
  return _(docs)
    .map(docToSearchData)
    .value();

  function docToSearchData(page) {
    return _.extend({ path: page.path}, page.searchTerms);
  };
};

function mapDocsToPageData(docs) {
  return _(docs)
    .map(function(doc) {
      return _.pick(doc, ['name', 'path']);
    })
    .indexBy('path')
    .value();
};
