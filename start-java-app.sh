#!/bin/bash

# Start emotion detection service
echo "Starting emotion detection service..."
cd emotion-service
python3 -c "
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

class EmotionHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'healthy'}).encode())

    def do_POST(self):
        if self.path == '/analyze-emotion':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            text = data.get('text', '').lower()
            
            if 'happy' in text or 'excited' in text:
                emotion, confidence = 'joy', 0.85
            elif 'miss' in text or 'remember' in text:
                emotion, confidence = 'nostalgia', 0.80
            elif 'love' in text:
                emotion, confidence = 'love', 0.75
            else:
                emotion, confidence = 'contemplative', 0.65
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'emotion': emotion, 'confidence': confidence}).encode())

HTTPServer(('localhost', 5001), EmotionHandler).serve_forever()
" &

cd ..

# Start Java Spring Boot application
echo "Starting Java Spring Boot application..."
mvn spring-boot:run