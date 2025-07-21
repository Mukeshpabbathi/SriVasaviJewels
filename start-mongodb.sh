#!/bin/bash

# Start MongoDB script for SVJ project
echo "Starting MongoDB..."

# Check if MongoDB is already running
if lsof -Pi :27017 -sTCP:LISTEN -t >/dev/null ; then
    echo "MongoDB is already running on port 27017"
else
    # Start MongoDB
    ./mongodb-macos-x86_64-7.0.0/bin/mongod --dbpath /Users/mukeshpabbathi/data/db --port 27017 --fork --logpath /Users/mukeshpabbathi/data/mongodb.log
    
    if [ $? -eq 0 ]; then
        echo "MongoDB started successfully!"
        echo "MongoDB is running on port 27017"
        echo "Log file: /Users/mukeshpabbathi/data/mongodb.log"
    else
        echo "Failed to start MongoDB"
        exit 1
    fi
fi
