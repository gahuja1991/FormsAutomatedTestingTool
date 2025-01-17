# AEM Forms Automated Testing tool

## How this Tool Helps?
   - Eliminates test flakiness by automatically implementing smart waits and retry mechanisms, ensuring more reliable test execution across different environments and network conditions
   - Enriches test scripts with robust assertions and validations, transforming basic click-through recordings into comprehensive test scenarios that verify both UI elements and business logic
   - Automatically identifies and validates correct API endpoints, ensuring proper integration testing by verifying both request/response patterns and data consistency 
   - Intelligently updates and maintains element selectors for repeatable panels and dynamic content, ensuring tests remain stable even when dealing with dynamically generated DOM elements


A step-by-step guide to record, optimize, and run Cypress tests for AEM Forms.

## Setup and Recording

### 1. Initial Setup
1. Download and extract the project zip file (cypressTool.zip) to get the directory structure 
2. Open terminal and navigate to the project directory:
   ```
   cd path/to/project
   ```
   Run the commands
    - ```npm install```
    - ```npx cypress install```
3. Launch Cypress:
   ```
   npx cypress open
   ```

### 2. Record Your Test
1. In Cypress Test Runner:
   - Select "E2E Testing"
   - Click "Start Testing in Chrome"
   - Select "test.cy.js" from the specs list

2. Record test steps:
   - Click the "Add commands" button in the test runner
   - ![img.png](https://adobe-my.sharepoint.com/:i:/r/personal/gahuja_adobe_com/Documents/CypressTestOptimizerTool/img.png?csf=1&web=1&e=RhTb5s)
   - Perform your test actions:
     - Fill in form fields
     - Click buttons
     - Submit forms
     - Verify elements and values
   - Click "Save Commands" to save your recorded test
   - Close the Cypress UI

## Test Optimization

### Files Needed
    -  Your test file (e.g., `cypress/e2e/test.cy.js`)
    -  Commands log file (e.g., `cypress/logs/commands.txt`)

### Quick Start
```bash
# Option 1: 
bash test_optimizer.sh <test_file> <commands_log>

# Option 2: 
chmod +x test_optimizer.sh    # First time only
./test_optimizer.sh <test_file> <commands_log>

# Example:
bash test_optimizer.sh cypress/e2e/test.cy.js cypress/logs/commands.txt
```

### Next Steps
1. Copy the output from terminal
2. Replace the contents of `test.cy.js` with the copied output

### Running the Optimized Test
   ```
   npx cypress run --spec "cypress/e2e/test.cy.js" --headed --browser chrome
   ```

## Troubleshooting
- Ensure all JSON is properly stringified
- Verify the local AEM Forms instance is running
- Check Cypress logs for any test execution errors

## NOTE
- Manual validation and review is required for the generated tests.
- Information that is not part of JSON would not get incorporated in the test.

## Minimum Cypress/Node version
- Cypress : 13.16.1
- Node : 20.9.0

