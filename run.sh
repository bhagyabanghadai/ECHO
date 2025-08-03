#!/bin/bash

# Build frontend if needed
if [ ! -d "src/main/resources/static" ] || [ ! -f "src/main/resources/static/index.html" ]; then
    echo "Building React frontend..."
    cd frontend && npm run build && cd ..
fi

# Run Spring Boot application
echo "Starting Spring Boot application on port 5000..."
mvn spring-boot:run