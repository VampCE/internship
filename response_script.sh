#!/bin/bash

# HTTP server URL (React front-end URL)


# Path to the file
FILE_PATH="/tmp/ready"

# Function to check the file, send POST request, and remove the file
check_file_and_send_post() {
    if [[ -f $FILE_PATH ]]; then
        echo "File $FILE_PATH exists. Sending POST request..."
        # Remove the file before sending the POST request
        rm $FILE_PATH
        echo "File $FILE_PATH removed."
        # Send HTTP POST request
        sleep 2
      curl -X POST "http://192.168.1.100:61001/ready" -d "Ready message received"
    fi
}

# Check the file every 5 seconds
while true; do
    check_file_and_send_post
done
