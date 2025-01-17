// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './democlientlib'

const excludedCommands = ['logToFile'];


const logs = {}
Cypress.on('log:added', (log) => {
  logs[log.id] = log
  window.testing.observeCommands();
  console.log(log)
})

Cypress.on('log:changed', (log) => {
  logs[log.id] = log
  console.log(log)
})

// after(() => {
//   cy.writeFile(`./logs/${Cypress.spec.name}.log.json`, logs);
// });


Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});


// Optional: Write logs at the end of each test
afterEach(() => {
      // window.testing.writeAllLogs();
      window.testing.checkStoredLogs().then(logs => {
        if (logs && logs.length > 0) {
          // Write to file using task
          cy.task('writeLogsToFile', { logs }).then(() => {
            console.log('Logs written after test');
          });
        }
      });
});