const Allure = require('allure-js-commons');
const stripAnsi = require('strip-ansi');
const Reporter = require('./reporter');
const fs = require('fs');

function registerAllureReporter() {
  const allure = new Allure();
  const reporter = (global.reporter = new Reporter(allure));
  let asyncFlow = null;
  let logError = [];
  let logPageError = [];

  const wait = async () => {
    await asyncFlow;
    asyncFlow = null;
  };

  const addTaskToFlow = callback => {
    if (asyncFlow == null) {
      asyncFlow = callback();
    } else {
      asyncFlow = asyncFlow.then(callback);
    }
  };

  const addStatus = async (spec, failure) => {
    let error;
    if (spec.status === 'pending') {
      error = { message: spec.pendingReason };
      return error;
    }
    if (spec.status === 'disabled') {
      error = { message: 'This test was disabled' };
      return error;
    }
    if (failure) {
      error = {
        message: stripAnsi(failure.message),
        stack: stripAnsi(failure.stack),
      };
      if (logError.length || logPageError.length) {
        const errorText = `${logError.join('\n')}\n${logPageError.join('\n')}`;
        allure.addAttachment('console error', errorText, 'text/plain');
      }
      const rx = /See diff for details: (.*)/g;
      const arrMessage = rx.exec(error.message);
      if (arrMessage) {
        const diffImage = fs.readFileSync(arrMessage[1]);
        allure.addAttachment('diff', diffImage, 'image/png');
        return error;
      }
      const screen = await page.screenshot();
      allure.addAttachment('screenshot', screen, 'image/png');
    }
    return error;
  };

  const addDescription = (spec) => {
    if (!process.env.PWD) {
      return;
    }
    const projectDirName = process.env.PWD.split('/').slice(-1)[0];
    const rx = new RegExp(`(?<=${projectDirName}\/).*`, 'g');
    const testPath = rx.exec(spec.testPath);
    if (testPath && testPath[0]) {
      const projectName = process.env.JOB_NAME ? process.env.JOB_NAME.split('/')[0] : projectDirName
      const webStormPath = `<a class='link' href='jetbrains://web-storm/navigate/reference?project=${projectName}&path=${testPath[0]}'>Открыть в WebStorm</a>`
      allure.setDescription(
        `${testPath[0]}<br><br>${webStormPath}`
      );
    }
  };

  const asyncSpecDone = async spec => {
    addDescription(spec);
    const failure =
      spec.failedExpectations && spec.failedExpectations.length
        ? spec.failedExpectations[0]
        : undefined;
    const error = await addStatus(spec, failure);
    allure.endCase(spec.status, error);
  };

  beforeEach(() => wait());
  afterAll(() => wait());

  jasmine.getEnv().addReporter({
    suiteStarted: suite => {
      addTaskToFlow(async () => {
        page.on('error', err => {
          logError.push(err.toString());
        });
        page.on('pageerror', pageErr => {
          logPageError.push(pageErr.toString());
        });
        allure.startSuite(suite.fullName);
      });
    },
    suiteDone: () => {
      addTaskToFlow(async () => allure.endSuite());
    },
    specStarted: spec => {
      addTaskToFlow(async () => {
        logError = [];
        logPageError = [];
        allure.startCase(spec.fullName);
        if (global.browserName) {
          allure.getCurrentTest().addParameter('argument', 'browserName', global.browserName);
        }
      });
    },
    specDone: spec => {
      addTaskToFlow(async () => asyncSpecDone(spec));
    },
  });
}

registerAllureReporter();

module.exports = registerAllureReporter;
