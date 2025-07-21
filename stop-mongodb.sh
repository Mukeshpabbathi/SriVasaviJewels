#!/bin/bash

# Stop MongoDB script for SVJ project
echo "Stopping MongoDB..."

# Find MongoDB process and kill it
MONGO_PID=$(lsof -ti :27017)

if [ -z "$MONGO_PID" ]; then
    echo "MongoDB is not running on port 27017"
else
    kill $MONGO_PID
    if [ $? -eq 0 ]; then
        echo "MongoDB stopped successfully!"
    else
        echo "Failed to stop MongoDB"
        exit 1
    fi
fi
