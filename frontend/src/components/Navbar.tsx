import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, User, Home, Brain } from 'lucide-react'
import axios from 'axios'

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem('user') !== null

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('user')
      navigate('/')
    }
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <Brain className="inline-block w-6 h-6 mr-2" />
            ECHO
          </Link>
          
          <ul className="navbar-nav">
            <li>
              <Link to="/">
                <Home className="inline-block w-4 h-4 mr-1" />
                Home
              </Link>
            </li>
            
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/dashboard">
                    <User className="inline-block w-4 h-4 mr-1" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/memories">
                    <Brain className="inline-block w-4 h-4 mr-1" />
                    Memories
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-secondary">
                    <LogOut className="inline-block w-4 h-4 mr-1" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="btn">Login</Link>
                </li>
                <li>
                  <Link to="/register" className="btn btn-secondary">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar