import React from 'react'
import ScraperForm from './components/ScraperForm'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-center">McFly Scraping</h1>
        <ScraperForm />
      </div>
    </div>
  )
}

export default App
