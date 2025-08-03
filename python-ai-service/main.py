"""
Python AI Service for ECHO
Provides emotion analysis, audio processing, and AI insights
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import re
import random
from typing import Dict, List, Any
import base64

app = FastAPI(title="ECHO AI Service", version="1.0.0")

class TextAnalysisRequest(BaseModel):
    text: str

class AudioRequest(BaseModel):
    audio: str  # Base64 encoded audio

class EmotionInsightRequest(BaseModel):
    emotion: str
    latitude: float | None = None
    longitude: float | None = None

# Emotion keywords for analysis
EMOTION_KEYWORDS = {
    "joy": ["happy", "excited", "thrilled", "delighted", "cheerful", "elated", "joyful", "blissful"],
    "love": ["love", "adore", "cherish", "heart", "affection", "romantic", "caring", "tender"],
    "nostalgia": ["remember", "childhood", "past", "memory", "nostalgic", "reminisce", "bygone", "yesterday"],
    "calm": ["peaceful", "serene", "tranquil", "quiet", "relaxed", "soothing", "gentle", "still"],
    "melancholy": ["sad", "down", "blue", "melancholy", "sorrowful", "gloomy", "dejected", "mournful"],
    "hope": ["hope", "optimistic", "future", "dream", "aspire", "believe", "faith", "promising"],
    "wonder": ["amazing", "incredible", "wonderful", "awe", "magical", "extraordinary", "magnificent", "breathtaking"],
    "excitement": ["thrilling", "exhilarating", "energetic", "dynamic", "vibrant", "electrifying", "stimulating"]
}

def analyze_emotion_from_text(text: str) -> Dict[str, Any]:
    """Analyze emotion from text using keyword matching and patterns"""
    text_lower = text.lower()
    
    # Count matches for each emotion
    emotion_scores = {}
    
    for emotion, keywords in EMOTION_KEYWORDS.items():
        score = sum(1 for keyword in keywords if keyword in text_lower)
        if score > 0:
            emotion_scores[emotion] = score
    
    # If no keyword matches, use sentiment patterns
    if not emotion_scores:
        if any(word in text_lower for word in ["!", "wow", "great", "awesome"]):
            emotion_scores["joy"] = 1
        elif any(word in text_lower for word in [".", "quiet", "moment", "peaceful"]):
            emotion_scores["calm"] = 1
        elif any(word in text_lower for word in ["beautiful", "stunning", "incredible"]):
            emotion_scores["wonder"] = 1
        else:
            # Default fallback
            emotion_scores["calm"] = 1
    
    # Get the emotion with highest score
    if emotion_scores:
        dominant_emotion = max(emotion_scores, key=lambda x: emotion_scores[x])
        max_score = emotion_scores[dominant_emotion]
    else:
        dominant_emotion = "calm"
        max_score = 1
    
    # Calculate confidence based on score and text length
    confidence = min(0.7 + (max_score * 0.1) + (len(text) / 1000), 0.98)
    
    return {
        "emotion": dominant_emotion,
        "confidence": round(confidence, 3),
        "all_scores": emotion_scores
    }

@app.post("/analyze-emotion")
async def analyze_emotion(request: TextAnalysisRequest):
    """Analyze emotion from text content"""
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        result = analyze_emotion_from_text(request.text)
        
        return {
            "emotion": result["emotion"],
            "confidence": result["confidence"],
            "analysis": result["all_scores"]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Emotion analysis failed: {str(e)}")

@app.post("/audio-to-text")
async def audio_to_text(request: AudioRequest):
    """Convert audio to text (simulated for demo)"""
    try:
        # In a real implementation, this would use speech-to-text services
        # For demo purposes, we'll return a simulated transcription
        
        if not request.audio:
            raise HTTPException(status_code=400, detail="Audio data cannot be empty")
        
        # Simulate processing time and return mock transcription
        mock_transcriptions = [
            "This place holds so many beautiful memories for me.",
            "I feel incredibly peaceful when I come here.",
            "The sunset from this spot always fills me with wonder.",
            "This location reminds me of childhood adventures.",
            "I love the energy and excitement of this vibrant area.",
            "There's something magical about this quiet corner of the world."
        ]
        
        transcription = random.choice(mock_transcriptions)
        
        return {
            "text": transcription,
            "confidence": round(random.uniform(0.85, 0.98), 3),
            "language": "en"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audio transcription failed: {str(e)}")

@app.post("/emotion-insights")
async def emotion_insights(request: EmotionInsightRequest):
    """Generate insights about emotions and locations"""
    try:
        emotion = request.emotion.lower()
        
        # Emotion-specific insights
        insights_map = {
            "joy": {
                "description": "Joy radiates from this location, creating positive energy that others can feel.",
                "relatedEmotions": ["excitement", "love", "wonder"],
                "tips": "Share this feeling by describing what specifically brings you joy here."
            },
            "love": {
                "description": "This place resonates with love and connection, drawing hearts together.",
                "relatedEmotions": ["joy", "calm", "nostalgia"],
                "tips": "Love shared in meaningful places creates lasting memories."
            },
            "nostalgia": {
                "description": "Nostalgia flows through this space, connecting past and present moments.",
                "relatedEmotions": ["melancholy", "love", "wonder"],
                "tips": "Nostalgic feelings often reveal what matters most to us."
            },
            "calm": {
                "description": "A sense of peace and tranquility emanates from this location.",
                "relatedEmotions": ["hope", "wonder", "love"],
                "tips": "Calm spaces offer refuge and help us reconnect with ourselves."
            },
            "melancholy": {
                "description": "There's a bittersweet beauty in the melancholy felt here.",
                "relatedEmotions": ["nostalgia", "hope", "calm"],
                "tips": "Melancholy can be a pathway to deeper understanding and growth."
            },
            "hope": {
                "description": "Hope springs eternal from this place, inspiring dreams and possibilities.",
                "relatedEmotions": ["joy", "love", "excitement"],
                "tips": "Places that inspire hope often become beacons for future visits."
            },
            "wonder": {
                "description": "Wonder and awe surround this location, opening minds to new possibilities.",
                "relatedEmotions": ["joy", "excitement", "calm"],
                "tips": "Wonder reminds us of the magic that exists in everyday moments."
            },
            "excitement": {
                "description": "Electric energy and excitement pulse through this vibrant location.",
                "relatedEmotions": ["joy", "wonder", "love"],
                "tips": "Exciting places fuel our passion and zest for life."
            }
        }
        
        # Get insights for the emotion, with fallback
        insights = insights_map.get(emotion, {
            "description": f"This location holds unique emotional significance related to {emotion}.",
            "relatedEmotions": ["calm", "wonder", "joy"],
            "tips": "Every emotion tells a story worth exploring."
        })
        
        # Add location-specific context if coordinates provided
        if request.latitude and request.longitude:
            insights["locationContext"] = f"Emotional resonance at coordinates {request.latitude:.4f}, {request.longitude:.4f}"
        
        return {
            "emotion": emotion,
            "insights": insights,
            "timestamp": "2025-01-03T12:00:00Z"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Insight generation failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ECHO AI Service"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "ECHO AI Service", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)