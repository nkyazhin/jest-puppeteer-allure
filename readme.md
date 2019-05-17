jest-pupputeer-allure
=========
[![NPM version](https://img.shields.io/npm/v/jest-puppeteer-allure.svg)](https://www.npmjs.com/package/puppeteer-rq)
[![NPM Downloads](https://img.shields.io/npm/dm/jest-puppeteer-allure.svg?style=flat)](https://www.npmjs.org/package/puppeteer-rq)

This package allows you to generate an allure report. The allure report contains screenshots and errors from the browser console if the test fails.
## Getting Started
### Prerequisites
The following packages must be installed in your project: `jest` and `puppeteer`.
And `page` variable should be global variable.
### Installing
```
npm install --save-dev jest-puppeteer-allure
```

### Usage
```
reporters: ["default", "jest-puppeteer-allure"],
```
``jest-puppeteer-allure`` reporter dynamically configure "setupTestFrameworkScriptFile" option in Jest configuration.
**If you have your own setupTestFrameworkScriptFile file**, you need to manually register reporter, for it you need add import:
```js
import registerAllureReporter from 'jest-puppeteer-allure/src/registerAllureReporter';
```


#### Advanced features
You can add description, screenshots, steps, severity and lots of other 
fancy stuff to your reports.

Global variable `reporter` available in your tests with such methods:

```
    description(description: string): this;
    severity(severity: Severity): this;
    epic(epic: string): this;
    feature(feature: string): this;
    story(story: string): this;
    startStep(name: string): this;
    endStep(status?: Status): this;
    addArgument(name: string): this;
    addEnvironment(name: string, value: string): this;
    addAttachment(name: string, buffer: any, type: string): this;
    addLabel(name: string, value: string): this;
    addParameter(paramName: string, name: string, value: string): this;
```
