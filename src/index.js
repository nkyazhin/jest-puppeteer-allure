class JestPuppeteerAllure {
  onTestStart(test) {
    const setupPath = require.resolve('./registerAllureReporter');
    const setupFilesAfterEnv = test.context.config.setupFilesAfterEnv;
    if (setupFilesAfterEnv) {
      setupFilesAfterEnv.push(setupPath);
      test.context.config = { ...test.context.config, setupFilesAfterEnv }
    } else {
      const setupTestFrameworkScriptFile = test.context.config.setupTestFrameworkScriptFile;
      if (!setupTestFrameworkScriptFile) {
        test.context.config = { ...test.context.config, setupTestFrameworkScriptFile: setupPath }
      } else {
        throw new Error('You have your own setupTestFrameworkScriptFile file, you need to manually register allure reporter.')
      }
    }
  }
}

module.exports = JestPuppeteerAllure;
