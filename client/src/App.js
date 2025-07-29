import React, { useState } from 'react';
import axios from 'axios';

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
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>Shorten a URL</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Enter long URL" value={originalUrl} onChange={e => setOriginalUrl(e.target.value)} required />
        <input placeholder="Custom shortcode (optional)" value={shortcode} onChange={e => setShortcode(e.target.value)} />
        <input type="number" placeholder="Validity in minutes (optional)" value={validity} onChange={e => setValidity(e.target.value)} />
        <button type="submit">Shorten</button>
      </form>
      {response && <p>Shortened URL: <a href={response}>{response}</a></p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App;
