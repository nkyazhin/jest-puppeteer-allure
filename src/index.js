class JestPuppeteerAllure {
  onTestStart(test) {
    console.log('sdasdsdsadsdsasadsad');
    const setupPath = require.resolve('./registerAllureReporter');
    console.log(test.context.config.setupTestFrameworkScriptFile);
    const setupTestFrameworkScriptFile = test.context.config.setupTestFrameworkScriptFile;
    if (!setupTestFrameworkScriptFile) {
      test.context.config = { ...test.context.config, setupTestFrameworkScriptFile: setupPath }
    } else {
      throw new Error('You have your own setupTestFrameworkScriptFile file, you need to manually register allure reporter.')
    }
  }
}

module.exports = JestPuppeteerAllure;