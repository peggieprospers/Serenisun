import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { typeLabel } from '../components/ServiceCard';

export default function Guide() {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);
    try {
      setResult(await api('/api/ai/recommend', { method: 'POST', body: { description } }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function viewTimes() {
    // Pass the AI output along so it can be attached to the booking
    navigate(`/services/${result.service.id}`, {
      state: {
        fromGuide: true,
        serviceId: result.service.id,
        description,
        reason: result.reason,
        instructorNote: result.instructorNote,
      },
    });
  }

  return (
    <main className="page">
      <h1>Find your session</h1>
      <p>
        Tell us about your experience, what you hope to feel or achieve, and how much time you
        have. Our guide will suggest a session.
      </p>

      <form onSubmit={handleSubmit} className="guide-form">
        <label htmlFor="description">About you</label>
        <textarea
          id="description"
          rows={5}
          maxLength={1000}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="For example: I'm new to yoga, sit at a desk all day, and want to unwind in the evenings. I have about 30 minutes."
          required
        />
        <div className="char-count">{description.length}/1000</div>
        <button className="btn" disabled={loading || description.trim().length < 10}>
          {loading ? 'Thinking...' : 'Get my recommendation'}
        </button>
      </form>
      <p className="disclaimer">Guidance only, not medical advice.</p>

      {error && <p className="error" role="alert">{error}</p>}

      {result && result.flagged && (
        <section className="notice" role="status">
          <p>{result.message}</p>
          <Link to="/services">Browse services</Link>
        </section>
      )}

      {result && !result.flagged && (
        <section className="result-card" role="status">
          <h2>{result.service.name}</h2>
          <p className="meta">
            {typeLabel(result.service.type)} · {result.service.durationMinutes} min · {result.service.category}
          </p>
          <p>{result.reason}</p>
          <h3>Note for your instructor</h3>
          <p>{result.instructorNote}</p>
          <button className="btn" onClick={viewTimes}>See open times</button>
        </section>
      )}
    </main>
  );
}