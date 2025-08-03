#!/usr/bin/env python3
import json
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer

class EmotionHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy", "model_loaded": True}).encode())
        else:
            self.send_error(404)

    def do_POST(self):
        if self.path == '/analyze-emotion':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            try:
                data = json.loads(post_data.decode('utf-8'))
                text = data.get('text', '').lower()
                
                # Simple keyword-based emotion detection
                if any(word in text for word in ['happy', 'excited', 'joy', 'great', 'amazing']):
                    emotion, confidence = 'joy', 0.85
                elif any(word in text for word in ['miss', 'remember', 'memory', 'past']):
                    emotion, confidence = 'nostalgia', 0.80
                elif any(word in text for word in ['love', 'adore', 'care', 'beautiful']):
                    emotion, confidence = 'love', 0.75
                elif any(word in text for word in ['calm', 'peaceful', 'quiet', 'serene']):
                    emotion, confidence = 'calm', 0.70
                elif any(word in text for word in ['hope', 'future', 'dream', 'tomorrow']):
                    emotion, confidence = 'hopeful', 0.68
                else:
                    emotion, confidence = 'contemplative', 0.65
                
                response = {
                    "emotion": emotion,
                    "confidence": confidence,
                    "method": "keyword_analysis"
                }
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_error(404)

if __name__ == '__main__':
    server = HTTPServer(('localhost', 5001), EmotionHandler)
    print("Emotion analysis service running on http://localhost:5001")
    server.serve_forever()