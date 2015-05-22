var _ = require('lodash');

/**
 * @dgProcessor populateSearchData
 * @description
 * This processor translates docs information to a Javascript file containing
 * relavant information to execute a search.
 */
module.exports = function populateSearchData(log, moduleMap) {

  return {
    $runAfter: ['extractKeywordsProcessor'],
    $runBefore: ['rendering-docs'],
    $process: process
  };

  function process(docs) {
    docs.push({
      docType: 'json-doc',
      id: 'search-data-json',
      template: 'json-doc.template.json',
      outputPath: 'js/search-data.json',
      data: mapDocsToSearchData(docs)
    });
  };
};

function mapDocsToSearchData(docs) {
  return _(docs)
    .filter(onlyPagesWithSearchTerms)
    .map(docToSearchData)
    .value();

  function onlyPagesWithSearchTerms(page) {
    return page.searchTerms;
  };

  function docToSearchData(page) {
    return _.extend({ path: page.path, name: page.name }, page.searchTerms);
  };
};
