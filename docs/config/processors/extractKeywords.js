var _ = require("lodash");

/**
 * @dgProcessor extractKeywordsProcessor
 * @description
 * This processor extracts all the keywords from each document and creates
 * a new document that will be rendered as a JavaScript file containing all
 * this data.
 */
module.exports = function extractKeywordsProcessor(log, readFilesProcessor) {

  return {
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: process
  };

  function process(docs) {
    _(docs)
      .filter(excludeModules)
      .filter(excludeUnknownDocTypes)
      .forEach(extractSearchTermsForDoc);
  };

  function excludeModules(doc) {
    // Currently no module has a page associated to it
    return doc.docType != 'module';
  };

  function excludeUnknownDocTypes(doc) {
    return doc.docType != undefined;
  };

  function extractSearchTermsForDoc(doc) {
    var words = [];
    var keywordMap = [];
    var members = [];
    var membersMap = {};

    // Search each top level property of the document for search terms
    _.forEach(doc, function(value, key) {

      if ( _.isString(value)) {
        extractWords(value, words, keywordMap);
      }

      if ( key === 'methods' || key === 'properties' || key === 'events' ) {
        _.forEach(value, function(member) {
          extractWords(member.name, members, membersMap);
        });
      }
    });


    doc.searchTerms = {
      titleWords: extractTitleWords(doc.name),
      keywords: _.sortBy(words).join(' '),
      members: _.sortBy(members).join(' ')
    };
  };

  function extractWords(text, words, keywordMap) {

    var KEYWORD_REGEX = /^((md:|[\$_a-z])[\w\-_]+)/;
    var tokens = text.toLowerCase().split(/[\.\s,`'"#]+/mg);
    _.forEach(tokens, function(token){
      var match = token.match(KEYWORD_REGEX);
      if (match){
        var key = match[1];
        if ( !keywordMap[key]) {
          keywordMap[key] = true;
          words.push(key);
        }
      }
    });
  };

  function extractTitleWords(title) {
    var match = /md([A-Z]\w*)/.exec(title);
    if ( match ) {
      title = title + ' ' + match[1].toLowerCase();
    }
    return title;
  };
};
