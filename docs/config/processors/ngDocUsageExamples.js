var _ = require('lodash');
var htmlParser = require('cheerio');

module.exports = function ngDocUsageExamples(log, moduleMap) {

  return {
    $runAfter: ['paths-computed'],
    $runBefore: ['rendering-docs'],
    $process: process
  };

  function process(docs) {
    var examples = _(docs)
      .filter(includeDocsWithUsage)
      .map(docUsageToCodeExamples)
      .indexBy('name')
      .value();

    docs.push({
      name: 'HLJS_EXAMPLES',
      template: 'constant-data.template.js',
      outputPath: 'js/hljs-examples.js',
      items: examples
    });
  };

  function includeDocsWithUsage(doc) {
    return doc.usage;
  };

  function docUsageToCodeExamples(doc) {
    var parsed = htmlParser.load(doc.usage);

    return {
      name: doc.name,
      js: codeFor('js'),
      html: '<div>' + codeFor('html') + '</div>' //wrap html to ensure it only has one root element
    };

    function codeFor(lang) {
      return parsed('[lang="' + lang + '"]').html() || '';
    }
  };
};
