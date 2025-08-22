import { config } from "./config";

interface GLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface EmotionAnalysis {
  primaryEmotion: string;
  confidence: number;
  emotions: Array<{
    emotion: string;
    intensity: number;
  }>;
  summary: string;
}

export class GLMService {
  private apiKey: string;
  private baseURL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
  private rateLimitDelay = 2000; // 2 seconds between requests
  private lastRequestTime = 0;

  constructor() {
    this.apiKey = config.GLM_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('GLM_API_KEY environment variable is required');
    }
  }

  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.rateLimitDelay) {
      const waitTime = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastRequestTime = Date.now();
  }

  async analyzeEmotion(text: string): Promise<EmotionAnalysis> {
    try {
      // Enforce rate limiting
      await this.enforceRateLimit();
      
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'glm-4-plus',
          messages: [
            {
              role: 'system',
              content: `You are an expert emotion analyst. Analyze the emotional content of text and respond with a JSON object containing:
{
  "primaryEmotion": "dominant emotion (nostalgia, joy, peace, love, warmth, contemplative, grateful, calm, hopeful, excitement, melancholy, wonder, etc.)",
  "confidence": confidence_score_0_to_1,
  "emotions": [
    {"emotion": "emotion_name", "intensity": intensity_0_to_1}
  ],
  "summary": "brief emotional summary in 1-2 sentences"
}

Focus on nuanced, specific emotions beyond basic happy/sad. Consider cultural context and subtle emotional undertones.`
            },
            {
              role: 'user',
              content: `Analyze the emotional content of this text: "${text}"`
            }
          ],
          temperature: 0.3,
          max_tokens: 300
        })
      });

      if (!response.ok) {
        throw new Error(`GLM API error: ${response.status} ${response.statusText}`);
      }

      const data: GLMResponse = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content received from GLM API');
      }

      // Parse the JSON response
      try {
        const analysis = JSON.parse(content) as EmotionAnalysis;
        
        // Validate the response structure
        if (!analysis.primaryEmotion || typeof analysis.confidence !== 'number') {
          throw new Error('Invalid analysis structure');
        }

        return analysis;
      } catch (parseError) {
        console.error('Failed to parse GLM response:', content);
        // Fallback analysis
        return {
          primaryEmotion: this.extractEmotionFromText(text),
          confidence: 0.7,
          emotions: [{ emotion: this.extractEmotionFromText(text), intensity: 0.7 }],
          summary: 'Emotion analysis completed with fallback method.'
        };
      }

    } catch (error) {
      console.error('GLM emotion analysis error:', error);
      
      // Return improved fallback analysis
      const fallbackEmotion = this.extractEmotionFromText(text);
      const intensity = this.calculateIntensity(text, fallbackEmotion);
      
      return {
        primaryEmotion: fallbackEmotion,
        confidence: 0.7,
        emotions: [{ emotion: fallbackEmotion, intensity }],
        summary: `Detected ${fallbackEmotion} emotion through text analysis.`
      };
    }
  }

  private extractEmotionFromText(text: string): string {
    const emotionKeywords = {
      'despair': ['die', 'death', 'suicide', 'kill', 'end', 'pain', 'hurt', 'depressed', 'awful'],
      'anger': ['hate', 'angry', 'mad', 'furious', 'rage', 'annoyed', 'frustrated'],
      'fear': ['scared', 'afraid', 'terrified', 'anxious', 'worried', 'nervous'],
      'sadness': ['sad', 'crying', 'tears', 'lonely', 'empty', 'broken', 'devastated'],
      'joy': ['happy', 'excited', 'amazing', 'wonderful', 'great', 'fantastic', 'delighted'],
      'love': ['love', 'adore', 'cherish', 'care', 'affection', 'heart', 'romance'],
      'peace': ['calm', 'peaceful', 'quiet', 'serene', 'tranquil', 'relaxed', 'zen'],
      'warmth': ['warm', 'cozy', 'comfort', 'embrace', 'gentle', 'tender'],
      'grateful': ['thankful', 'grateful', 'appreciate', 'blessed', 'lucky'],
      'hopeful': ['hope', 'future', 'dream', 'wish', 'aspire', 'optimistic'],
      'excitement': ['excited', 'thrilled', 'eager', 'energetic', 'pumped'],
      'nostalgia': ['remember', 'back then', 'used to', 'childhood', 'old', 'past'],
      'contemplative': ['think', 'wonder', 'ponder', 'reflect', 'consider', 'meditate']
    };

    const lowerText = text.toLowerCase();
    
    // Check for negative emotions first to catch serious content
    const priorityOrder = ['despair', 'anger', 'fear', 'sadness', 'joy', 'love', 'peace', 'warmth', 'grateful', 'hopeful', 'excitement', 'nostalgia', 'contemplative'];
    
    for (const emotion of priorityOrder) {
      const keywords = emotionKeywords[emotion as keyof typeof emotionKeywords];
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        return emotion;
      }
    }

    return 'contemplative'; // Default emotion
  }

  private calculateIntensity(text: string, emotion: string): number {
    const lowerText = text.toLowerCase();
    let intensity = 0.5; // Base intensity
    
    // Increase intensity based on emotional keywords count
    const intensityBoosts = {
      'despair': ['really', 'so', 'very', 'extremely', 'totally', 'completely'],
      'anger': ['really', 'so', 'very', 'extremely', 'totally', 'fucking'],
      'joy': ['really', 'so', 'very', 'extremely', 'amazing', 'incredible'],
      'love': ['really', 'so', 'very', 'deeply', 'truly', 'completely']
    };
    
    const boosts = intensityBoosts[emotion as keyof typeof intensityBoosts] || ['really', 'so', 'very'];
    const boostCount = boosts.filter(boost => lowerText.includes(boost)).length;
    
    // Adjust intensity based on text length and boost words
    intensity += boostCount * 0.2;
    intensity += Math.min(text.length / 100, 0.3); // Longer text = more intensity
    
    return Math.min(intensity, 1.0); // Cap at 1.0
  }

  async analyzeVoiceTranscript(transcript: string, context?: string): Promise<EmotionAnalysis> {
    const contextualText = context 
      ? `Context: ${context}\n\nTranscript: ${transcript}`
      : transcript;
    
    return this.analyzeEmotion(contextualText);
  }
}

export const glmService = new GLMService();