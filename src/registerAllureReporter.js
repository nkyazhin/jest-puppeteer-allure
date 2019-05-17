const Allure = require('allure-js-commons');
const stripAnsi = require('strip-ansi');
const Reporter = require('./reporter');

function registerAllureReporter() {
  const allure = new Allure();
  const reporter = (global.reporter = new Reporter(allure));
  let asyncFlow = null;
  let logError = [];
  let logPageError = [];

  const waitAfterEach = async () => {
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

  const addStatus = async (spec, screen, failure) => {
    let error;
    if (spec.status === 'pending') {
      error = { message: spec.pendingReason };
    }
    if (spec.status === 'disabled') {
      error = { message: 'This test was disabled' };
    }
    if (failure) {
      error = {
        message: stripAnsi(failure.message),
        stack: stripAnsi(failure.stack),
      };
      allure.addAttachment('screenshot', screen, 'image/png');
      if (logError.length || logPageError.length) {
        const errorText = `${logError.join('\n')}\n${logPageError.join('\n')}`;
        allure.addAttachment('console error', errorText, 'text/plain');
      }
    }
    allure.endCase(spec.status, error);
  };

  const asyncSpecDone = async spec => {
    const failure =
      spec.failedExpectations && spec.failedExpectations.length
        ? spec.failedExpectations[0]
        : undefined;
    let screen;
    if (failure) {
      screen = await page.screenshot();
    }
    await addStatus(spec, screen, failure);
  };

  afterAll(() => waitAfterEach());

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
      });
    },
    specDone: spec => {
      addTaskToFlow(async () => asyncSpecDone(spec));
    },
  });
}

registerAllureReporter();

module.exports = registerAllureReporter;
