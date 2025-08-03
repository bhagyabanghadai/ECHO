from flask import Flask, request, jsonify
import logging
import re

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model_loaded": True})

@app.route('/analyze-emotion', methods=['POST'])
def analyze_emotion():
    """Analyze emotion from text input using keyword-based detection"""
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field in request"}), 400
            
        text = data['text'].strip()
        if not text:
            return jsonify({"error": "Empty text provided"}), 400
            
        logger.info(f"Analyzing emotion for text: {text[:100]}...")
        
        # Keyword-based emotion detection
        emotion, confidence = detect_emotion_keywords(text)
        
        logger.info(f"Detected emotion: {emotion} (confidence: {confidence})")
        
        return jsonify({
            "emotion": emotion,
            "confidence": confidence,
            "method": "keyword_analysis"
        })
        
    except Exception as e:
        logger.error(f"Error analyzing emotion: {e}")
        return jsonify({"error": "Failed to analyze emotion"}), 500

def detect_emotion_keywords(text):
    """Detect emotion using keyword matching"""
    text_lower = text.lower()
    
    # Emotion keyword patterns
    emotion_patterns = {
        'joy': ['happy', 'joy', 'excited', 'amazing', 'wonderful', 'great', 'fantastic', 'love', 'smile', 'laugh'],
        'nostalgia': ['miss', 'remember', 'memory', 'past', 'used to', 'back then', 'childhood', 'old', 'nostalgia'],
        'love': ['love', 'adore', 'care', 'heart', 'sweet', 'beautiful', 'precious', 'dear', 'cherish'],
        'calm': ['peaceful', 'calm', 'quiet', 'serene', 'tranquil', 'relaxed', 'still', 'gentle'],
        'excitement': ['excited', 'thrilled', 'pumped', 'can\'t wait', 'amazing', 'incredible', 'awesome'],
        'contemplative': ['think', 'wonder', 'reflect', 'consider', 'ponder', 'question', 'maybe', 'perhaps'],
        'hopeful': ['hope', 'future', 'dream', 'wish', 'possibility', 'tomorrow', 'someday', 'believe'],
        'grateful': ['thank', 'grateful', 'appreciate', 'blessed', 'fortunate', 'lucky']
    }
    
    # Count matches for each emotion
    emotion_scores = {}
    for emotion, keywords in emotion_patterns.items():
        score = 0
        for keyword in keywords:
            # Count occurrences of each keyword
            score += len(re.findall(r'\b' + re.escape(keyword) + r'\b', text_lower))
        emotion_scores[emotion] = score
    
    # Find emotion with highest score
    if max(emotion_scores.values()) == 0:
        return 'contemplative', 0.6  # Default emotion
    
    best_emotion = max(emotion_scores, key=emotion_scores.get)
    max_score = emotion_scores[best_emotion]
    
    # Calculate confidence based on keyword matches
    confidence = min(0.95, 0.5 + (max_score * 0.15))
    
    return best_emotion, round(confidence, 3)

if __name__ == "__main__":
    logger.info("Starting simple emotion analysis service...")
    app.run(host='0.0.0.0', port=5001, debug=False)