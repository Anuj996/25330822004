import React, { useState } from 'react';
import axios from 'axios';
import './app.css'; // ✅ Make sure the file is named 'App.css' (not 'app.css')

function App() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortcode, setShortcode] = useState('');
  const [validity, setValidity] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/shorturls', {
        originalUrl,
        shortcode,
        validForMinutes: validity ? parseInt(validity) : undefined
      });
      setResponse(res.data.shortUrl);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error');
      setResponse('');
    }
  };

  return (
    <div className="container">
      <h2>Shorten a URL</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="url"
          placeholder="Enter long URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom shortcode (optional)"
          value={shortcode}
          onChange={(e) => setShortcode(e.target.value)}
        />
        <input
          type="number"
          placeholder="Validity in minutes (optional)"
          value={validity}
          onChange={(e) => setValidity(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>

      {response && (
        <p className="response">
          Shortened URL: <a href={response} target="_blank" rel="noopener noreferrer">{response}</a>
        </p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
