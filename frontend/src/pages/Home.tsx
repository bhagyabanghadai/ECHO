import React from 'react'
import { Link } from 'react-router-dom'
import { Brain, Users, MapPin, Sparkles } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="container">
      <div className="hero" style={{ textAlign: 'center', padding: '4rem 0' }}>
        <Brain className="mx-auto mb-4" size={64} color="#3b82f6" />
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', color: '#1f2937' }}>
          Welcome to ECHO
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#6b7280', maxWidth: '600px', margin: '0 auto 2rem' }}>
          An advanced geospatial emotional memory platform that transforms personal experiences 
          into a rich, interactive, and socially connected narrative ecosystem.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn" style={{ fontSize: '1.1rem', padding: '12px 24px' }}>
            Get Started
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '12px 24px' }}>
            Sign In
          </Link>
        </div>
      </div>

      <div className="features" style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', color: '#1f2937' }}>
          Features
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <Brain className="mx-auto mb-3" size={48} color="#3b82f6" />
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Emotional Memories</h3>
            <p style={{ color: '#6b7280' }}>
              Capture and analyze your emotional experiences with AI-powered sentiment analysis.
            </p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <MapPin className="mx-auto mb-3" size={48} color="#3b82f6" />
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Location-Based Discovery</h3>
            <p style={{ color: '#6b7280' }}>
              Discover memories and connect with others based on shared locations and experiences.
            </p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <Users className="mx-auto mb-3" size={48} color="#3b82f6" />
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Social Connection</h3>
            <p style={{ color: '#6b7280' }}>
              Build meaningful connections through shared emotional experiences and memories.
            </p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <Sparkles className="mx-auto mb-3" size={48} color="#3b82f6" />
            <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>AI-Powered Insights</h3>
            <p style={{ color: '#6b7280' }}>
              Get intelligent insights about your emotional patterns and memory connections.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home