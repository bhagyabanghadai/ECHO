import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Brain, MapPin, Clock } from 'lucide-react'
import axios from 'axios'

interface Memory {
  id: number
  title: string
  content: string
  emotion: string
  latitude?: number
  longitude?: number
  createdAt: string
}

const Dashboard: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newMemory, setNewMemory] = useState({
    title: '',
    content: '',
    emotion: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (!user) {
      navigate('/login')
      return
    }
    
    fetchMemories()
  }, [navigate])

  const fetchMemories = async () => {
    try {
      const response = await axios.get('/api/memories/user', {
        withCredentials: true
      })
      setMemories(response.data.memories || [])
    } catch (error) {
      console.error('Error fetching memories:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateMemory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/memories', newMemory, {
        withCredentials: true
      })
      setNewMemory({ title: '', content: '', emotion: '' })
      setShowCreateForm(false)
      fetchMemories()
    } catch (error) {
      console.error('Error creating memory:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ color: '#1f2937' }}>Your Dashboard</h1>
        <button 
          onClick={() => setShowCreateForm(true)} 
          className="btn"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={16} />
          New Memory
        </button>
      </div>

      {showCreateForm && (
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Create New Memory</h3>
          <form onSubmit={handleCreateMemory}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={newMemory.title}
                onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={newMemory.content}
                onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                required
                style={{ 
                  width: '100%', 
                  minHeight: '100px', 
                  padding: '10px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '5px',
                  resize: 'vertical'
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="emotion">Emotion</label>
              <select
                id="emotion"
                value={newMemory.emotion}
                onChange={(e) => setNewMemory({ ...newMemory, emotion: e.target.value })}
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '5px'
                }}
              >
                <option value="">Select an emotion</option>
                <option value="happy">Happy</option>
                <option value="sad">Sad</option>
                <option value="excited">Excited</option>
                <option value="peaceful">Peaceful</option>
                <option value="anxious">Anxious</option>
                <option value="grateful">Grateful</option>
                <option value="nostalgic">Nostalgic</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn">Create Memory</button>
              <button 
                type="button" 
                onClick={() => setShowCreateForm(false)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {memories.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <Brain size={48} color="#9ca3af" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ color: '#6b7280', marginBottom: '1rem' }}>No memories yet</h3>
            <p style={{ color: '#9ca3af' }}>
              Create your first memory to start building your emotional journey.
            </p>
          </div>
        ) : (
          memories.map((memory) => (
            <div key={memory.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3 style={{ color: '#1f2937', margin: 0 }}>{memory.title}</h3>
                <span style={{ 
                  backgroundColor: '#e0f2fe', 
                  color: '#0277bd', 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.875rem',
                  textTransform: 'capitalize'
                }}>
                  {memory.emotion}
                </span>
              </div>
              <p style={{ color: '#4b5563', marginBottom: '1rem', lineHeight: '1.6' }}>
                {memory.content}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={14} />
                  {formatDate(memory.createdAt)}
                </span>
                {memory.latitude && memory.longitude && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <MapPin size={14} />
                    Location saved
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Dashboard