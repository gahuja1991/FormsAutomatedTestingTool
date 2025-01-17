((window) => {

    let observerInitialized = false;  // Flag to track initialization
    
    let db;

    // Initialize IndexedDB
    const initDB = () => {
        return new Promise((resolve, reject) => {
            const request = window.top.indexedDB.open('CypressLogs', 1);

            request.onerror = (event) => {
                console.error('IndexedDB error:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                console.log('IndexedDB initialized');
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('logs')) {
                    db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
                }
            };
        });
    };


    
        const getStoredLogs = () => {
        return new Promise((resolve, reject) => {
            if (!db) {
                resolve([]);
                return;
            }

            const transaction = db.transaction(['logs'], 'readonly');
            const store = transaction.objectStore('logs');
            const request = store.getAll();

            request.onsuccess = () => {
                const logs = request.result.map(item => item.message);
                resolve(logs);
            };

            request.onerror = (event) => {
                console.error('Error reading logs:', event.target.error);
                reject(event.target.error);
            };
        });
    };

    const storeLogs = (logs) => {
        return new Promise((resolve, reject) => {
            if (!db) {
                console.error('DB not initialized when storing logs');
                reject(new Error('Database not initialized'));
                return;
            }

            const transaction = db.transaction(['logs'], 'readwrite');
            const store = transaction.objectStore('logs');

            console.log('Storing logs:', logs);

            // Add new logs without clearing
            logs.forEach(message => {
                const request = store.add({ message });
                request.onsuccess = () => {
                    console.log('Successfully stored log:', message);
                };
                request.onerror = (error) => {
                    console.error('Error storing individual log:', error);
                };
            });

            transaction.oncomplete = () => {
                console.log('All logs stored successfully');
                resolve();
            };

            transaction.onerror = (event) => {
                console.error('Error storing logs:', event.target.error);
                reject(event.target.error);
            };
        });
    };

    const parseCommandText = (text) => {
        // Remove prefix digits and add space before #
        let parsedText = text
            .replace(/^\d+/, '')  // Remove prefix digits
            .replace(/#/g, ' #')  // Add space before #
            .trim();             // Remove any extra spaces
        
        if (parsedText.includes('get #') && !parsedText.match(/#[a-zA-Z]+-[a-zA-Z0-9-]+/)) {
            try {
                // Get the element ID from the command
                const elementId = parsedText.split('#')[1].trim();
                // Find the element in the DOM

                const element = cy.state('window').document.getElementById(elementId)
                
                if (element) {
                    // Add the element's HTML to the log message
                    const fs = element.closest('fieldset');
                    const pc= fs.closest('[id^="panelcontainer-"]');
                    const repeatablePanelId = pc.getAttribute('id');
                    const dataIndex = fs.getAttribute('data-index');
                    let panelSelector = `#${repeatablePanelId} [data-index='${dataIndex}']`;
                    let selectedElement = cy.state('window').document.querySelector(panelSelector);
                    parsedText += ` #${repeatablePanelId} [data-index='${dataIndex}'] && (${selectedElement.outerHTML})`;
                }
            } catch (error) {
                console.error('Error getting element HTML:', error);
            }
        }
        return parsedText;
    };

    // Clear all logs from DB
    const clearDB = () => {
        return new Promise((resolve, reject) => {
            if (!db) {
                resolve();
                return;
            }

            const transaction = db.transaction(['logs'], 'readwrite');
            const store = transaction.objectStore('logs');
            const clearRequest = store.clear();
            
            clearRequest.onsuccess = () => {
                console.log('IndexedDB cleared');
                resolve();
            };
            
            clearRequest.onerror = (error) => {
                console.error('Error clearing IndexedDB:', error);
                reject(error);
            };
        });
    };

    const testing = {
        observeCommands: () => {
            // Return early if already initialized
            if (observerInitialized) {
              return;
            }
            console.log('Initializing command observer for cypress studio');
           
            // First ensure DB is initialized
            initDB().then(() => {
                // const targetNode = cy.state('window').top.document.querySelector('ul.commands-container');
                const targetNode = window.top.document.querySelector('.studio-active .hooks-container ul.commands-container');
    
                if (targetNode) {
                    console.log('Found commands container');
                    // Then clear it when target node is found
                    return clearDB().then(() => {
                        console.log('DB cleared, setting up observer');
                        const observer = new MutationObserver((mutations) => {
                            mutations.forEach((mutation) => {
                                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                                    mutation.addedNodes.forEach((node) => {
                                        if (node.nodeName === 'LI') {
                                            const timestamp = Date.now();
                                            const parsedText = parseCommandText(node.textContent);
                                            const logMessage = `${timestamp} - ${parsedText}`;
                                            
                                            storeLogs([logMessage])
                                                .then(() => {
                                                    console.log('Successfully added new command');
                                                })
                                                .catch(error => {
                                                    console.error('Error handling log:', error);
                                                });

                                            console.log('New command added:', node.textContent);
                                        }
                                    });
                                }
                            });
                        });
      
                        observer.observe(targetNode, {
                            childList: true,
                            subtree: false
                        });

                        observerInitialized = true;
                        console.log('Command observer initialized');
                    });
                } else {
                    console.log('Commands container not found');
                }
            }).catch(error => {
                console.error('Failed to initialize IndexedDB:', error);
            });
        },
        writeAllLogs: () => {
            console.log('Writing all stored logs...');
            getStoredLogs()
                .then(logs => {
                    if (logs.length > 0) {
                        console.log('Found logs to write:', logs);
                        window.top.sessionStorage.setItem('logsToWrite', JSON.stringify(logs));
                        return storeLogs([]);
                    }
                })
                .then(() => {
                    console.log('All logs stored for writing');
                })
                .catch(error => {
                    console.error('Error writing logs:', error);
                });
        },

        checkStoredLogs: () => {
            return getStoredLogs()
                .then(logs => {
                    console.log('Currently stored logs:', logs);
                    return logs;
                })
                .catch(error => {
                    console.error('Error checking logs:', error);
                    return [];
                });
        }

      };
    
      window.testing = testing;
  })(window);