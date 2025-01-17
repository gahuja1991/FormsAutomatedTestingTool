#!/bin/bash

# Default URL
DEFAULT_URL="https://livecycle-formsgenai-service-deploy-ethos11-stage-c8df77.stage.cloud.adobe.io"

# Check if correct number of arguments (2 or 3) are provided
if [ "$#" -lt 2 ] || [ "$#" -gt 3 ]; then
    echo "Usage: $0 <test_file> <logs_file> [api_url]"
    echo "Example: $0 test.cy.js logs.txt"
    echo "Example with custom URL: $0 test.cy.js logs.txt http://localhost:8080"
    exit 1
fi

# Get file paths from arguments
TEST_FILE="$1"
LOGS_FILE="$2"
# Use third parameter as API_URL if provided, otherwise use default
API_URL="${3:-$DEFAULT_URL}"

# Check if files exist
if [ ! -f "$TEST_FILE" ]; then
    echo "Error: Test file '$TEST_FILE' does not exist"
    exit 1
fi

if [ ! -f "$LOGS_FILE" ]; then
    echo "Error: Logs file '$LOGS_FILE' does not exist"
    exit 1
fi

echo "Sending request with:"
echo "API URL: $API_URL"
echo "Test file: $TEST_FILE"
echo "Logs file: $LOGS_FILE"
echo "----------------------------------------"
echo "Request sent. Waiting for response..."
echo -n "Processing"

# Make the curl request with progress indicator
(curl -X POST "${API_URL}/adobe/formsgenai/test_optimizer" \
  -H "accept: text/plain" \
  -H "Content-Type: multipart/form-data" \
  -F "test=@$TEST_FILE" \
  -F "reference_logs=@$LOGS_FILE" \
  --max-time 300 \
  -s -o response.tmp) &

# Show progress dots while waiting
while kill -0 $! 2>/dev/null; do
    echo -n "."
    sleep 5
done

echo -e "\n\nUpdated test:"
echo "----------------------------------------"

cat response.tmp
rm response.tmp

echo -e "\n----------------------------------------"