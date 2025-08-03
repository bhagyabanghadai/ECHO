from transformers import pipeline
from flask import Flask, request, jsonify
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Initialize emotion classifier with Hugging Face model
logger.info("Loading emotion classification model...")
try:
    emotion_classifier = pipeline(
        "text-classification", 
        model="j-hartmann/emotion-english-distilroberta-base",
        return_all_scores=True
    )
    logger.info("Emotion classifier loaded successfully")
except Exception as e:
    logger.error(f"Failed to load emotion classifier: {e}")
    emotion_classifier = None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model_loaded": emotion_classifier is not None})

@app.route('/analyze-emotion', methods=['POST'])
def analyze_emotion():
    """Analyze emotion from text input"""
    try:
        if not emotion_classifier:
            return jsonify({"error": "Emotion classifier not available"}), 500
            
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Missing 'text' field in request"}), 400
            
        text = data['text'].strip()
        if not text:
            return jsonify({"error": "Empty text provided"}), 400
            
        logger.info(f"Analyzing emotion for text: {text[:100]}...")
        
        # Get emotion predictions
        results = emotion_classifier(text)
        
        # Find the emotion with highest confidence
        top_emotion = max(results, key=lambda x: x['score'])
        
        # Map emotion labels to ECHO's emotion categories
        emotion_mapping = {
            'joy': 'joy',
            'sadness': 'nostalgia', 
            'anger': 'contemplative',
            'fear': 'calm',
            'surprise': 'excitement',
            'disgust': 'contemplative',
            'love': 'love'
        }
        
        detected_emotion = emotion_mapping.get(top_emotion['label'].lower(), 'contemplative')
        confidence = round(top_emotion['score'], 3)
        
        logger.info(f"Detected emotion: {detected_emotion} (confidence: {confidence})")
        
        return jsonify({
            "emotion": detected_emotion,
            "confidence": confidence,
            "raw_results": results
        })
        
    except Exception as e:
        logger.error(f"Error analyzing emotion: {e}")
        return jsonify({"error": "Failed to analyze emotion"}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001, debug=False)