import React, { useState } from 'react'

export default function ScraperForm() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setDownloadUrl('')
    if (!url) {
      setError('Por favor, insira uma URL válida.')
      return
    }
    setLoading(true)

    try {
      const response = await fetch('https://mcflyscrap3.onrender.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      })

      if (!response.ok) {
        const err = await response.json()
        setError(err.detail || 'Erro ao fazer scraping.')
        setLoading(false)
        return
      }

      const blob = await response.blob()
      const blobUrl = window.URL.createObjectURL(blob)
      setDownloadUrl(blobUrl)
    } catch (e) {
      setError('Erro de conexão ou inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block text-lg font-semibold" htmlFor="url">URL do site para scraping:</label>
      <input
        id="url"
        type="text"
        className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 focus:border-purple-500 outline-none"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={loading}
      />
      {error && <p className="text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-md font-semibold transition-colors ${
          loading ? 'bg-purple-700 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'
        }`}
      >
        {loading ? 'Processando...' : 'Iniciar Scraping'}
      </button>

      {downloadUrl && (
        <a
          href={downloadUrl}
          download="mcfly_scraping.zip"
          className="block text-center mt-4 text-purple-400 underline hover:text-purple-600"
        >
          Baixar ZIP do site
        </a>
      )}
    </form>
  )
}
