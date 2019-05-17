const Status = {
  Passed: 'passed',
  Pending: 'pending',
  Skipped: 'skipped',
  Failed: 'failed',
  Broken: 'broken',
};

const Severity = {
  Blocker: 'blocker',
  Critical: 'critical',
  Normal: 'normal',
  Minor: 'minor',
  Trivial: 'trivial',
};

class Reporter {
  constructor(allure) {
    this.allure = allure;
  }

  description(description) {
    this.allure.setDescription(description);
    return this;
  }

  severity(severity) {
    this.addLabel('severity', severity);
    return this;
  }

  epic(epic) {
    this.addLabel('epic', epic);
    return this;
  }

  feature(feature) {
    this.addLabel('feature', feature);
    return this;
  }

  story(story) {
    this.addLabel('story', story);
    return this;
  }

  startStep(name) {
    this.allure.startStep(name);
    return this;
  }

  endStep(status = Status.Passed) {
    this.allure.endStep(status);
    return this;
  }

  addArgument(name) {
    this.allure.startStep(name);
    return this;
  }

  addEnvironment(name, value) {
    this.allure
      .getCurrentTest()
      .addParameter('environment-variable', name, value);
    return this;
  }

  addAttachment(name, buffer, type) {
    this.allure.addAttachment(name, buffer, type);
    return this;
  }

  addLabel(name, value) {
    this.allure.getCurrentTest().addLabel(name, value);
    return this;
  }

  addParameter(paramName, name, value) {
    this.allure.getCurrentTest().addParameter(paramName, name, value);
    return this;
  }
}
module.exports = Reporter;
