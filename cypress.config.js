const { defineConfig } = require("cypress");
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    experimentalStudio:true,
    chromeWebSecurity:false,
    setupNodeEvents(on, config) {
      console.log('Cypress config initializing... aaaa ')

      on('task', {
        writeLogsToFile({ logs }) {
          try {
            const logsDir = path.join(__dirname, 'cypress', 'logs')
            console.log('Writing to directory:', logsDir)

            // Create logs directory if it doesn't exist
            if (!fs.existsSync(logsDir)) {
              fs.mkdirSync(logsDir, { recursive: true })
            }

            const filePath = path.join(logsDir, 'commands.txt')
            fs.writeFileSync(filePath, logs.join('\n') + '\n', 'utf8')

            // fs.appendFileSync(filePath, logs.join('\n') + '\n\n')  // Added extra newline between test runs
            
            console.log('Logs written to:', filePath)
            return null
          } catch (error) {
            console.error('Error writing to file:', error)
            return null
          }
        }
      })

      on('task', {
        logCommandData({ message }) {
          try {
            const logsDir = path.resolve('cypress/logs');
            
            // Add debug logging
            console.log('Writing to directory:', logsDir)
            
            // Create logs directory if it doesn't exist
            if (!fs.existsSync(logsDir)) {
              console.log('Creating logs directory')
              fs.mkdirSync(logsDir, { recursive: true })
            }

            const filePath = path.join(logsDir, 'commands.txt')
            console.log('Writing to file:', filePath)
            
            // Append to commands.txt
            fs.appendFileSync(filePath, message + '\n')
            
            console.log('Successfully wrote to file')
            return null
          } catch (error) {
            console.error('Error writing to file:', error)
            return null
          }
        }
      })

      // on('task', {
      //   logToFile({ message }) {
      //     const logFilePath = path.resolve('cypress/logs/command_logs.txt');
          
      //     // Ensure logs directory exists
      //     if (!fs.existsSync(path.dirname(logFilePath))) {
      //       fs.mkdirSync(path.dirname(logFilePath), { recursive: true });
      //     }

      //     // Append the message to the file
      //     fs.appendFileSync(logFilePath, `${message}\n`, 'utf8');
      //     return null; // Indicate task completion
      //   },
      // });

      // installLogsPrinter(on, {
      //   printLogsToFile:"always",
      //   outputRoot: 'cypress/results/detailCommandLogs1',
      //   outputTarget: {
      //     'detailCommandLogs.json': 'json',
      //   }
      // });


    },
  },
});
