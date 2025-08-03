#!/bin/bash

# Start Python AI Service in background
echo "Starting Python AI Service..."
cd python-ai-service
python main.py &
PYTHON_PID=$!
cd ..

echo "Python AI Service started with PID: $PYTHON_PID"

# Wait a moment for Python service to start
sleep 3

# Start Java Spring Boot Application
echo "Starting Java Spring Boot Application..."
export SERVER_PORT=5000
export SPRING_PROFILES_ACTIVE=development

# Check if Maven is available
if command -v mvn &> /dev/null; then
    mvn spring-boot:run
else
    echo "Maven not found, trying with Java directly..."
    # Compile and run with Java
    mkdir -p target/classes
    find src/main/java -name "*.java" -exec javac -d target/classes -cp "$(find ~/.m2/repository -name "*.jar" | tr '\n' ':')" {} +
    java -cp "target/classes:$(find ~/.m2/repository -name "*.jar" | tr '\n' ':')" com.echo.EchoApplication
fi

# Cleanup on exit
trap "kill $PYTHON_PID 2>/dev/null" EXIT