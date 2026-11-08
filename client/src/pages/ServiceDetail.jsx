import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { typeLabel } from '../components/ServiceCard';
import { formatTime } from '../utils/format';

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
// Only use the guide's output if it was for THIS service
  const guide =
    location.state && location.state.fromGuide && location.state.serviceId === id
      ? location.state
      : null;
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState(null); // the session currently being booked
  const [reloadKey, setReloadKey] = useState(0); // bump to refetch spots left

  useEffect(() => {
    api(`/api/services/${id}`)
      .then(setData)
      .catch((err) => setError(err.message));
  }, [id, reloadKey]);

  async function book(sessionId) {
    if (!user) {
      navigate('/login');
      return;
    }
    setMessage('');
    setError('');
    setBusyId(sessionId);
    try {
      await api('/api/bookings', {
        method: 'POST',
        body: {
          sessionId,
          ...(guide && {
            userDescription: guide.description,
            aiRecommendation: guide.reason,
            instructorNote: guide.instructorNote,
          }),
        },
      });
      setMessage('Booking confirmed.');
      setReloadKey((key) => key + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (!data) {
    return error
      ? <main className="page"><p className="error" role="alert">{error}</p></main>
      : <p className="status">Loading...</p>;
  }

  const { service, sessions } = data;

  return (
    <main className="page">
      <Link to="/services" className="back-link">← All services</Link>
      <h1>{service.name}</h1>
      <p className="meta">
        {typeLabel(service.type)} · {service.durationMinutes} min · {service.category}
        {service.isOnline && ' · Online'}
      </p>
      <p>{service.description}</p>

{guide && (
  <aside className="guide-note">
    <strong>Your guide suggests this session</strong>
    <p>{guide.reason}</p>
  </aside>
)}

      <h2>Open sessions</h2>
      {message && <p className="success" role="status">{message}</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {sessions.length === 0 && <p>No upcoming sessions yet. Please check back soon.</p>}

      <ul className="session-list">
        {sessions.map((s) => (
          <li key={s.id} className="session">
            <div>
              <strong>{formatTime(s.startsAt)}</strong>
              <div className="spots">
                with {s.instructor} ·{' '}
                {s.spotsLeft === 0
                  ? 'Full'
                  : s.capacity === 1
                    ? 'Available'
                    : `${s.spotsLeft} of ${s.capacity} spots left`}
              </div>
            </div>
            <button
              className="btn"
              disabled={s.spotsLeft === 0 || busyId === s.id}
              onClick={() => book(s.id)}
            >
              {s.spotsLeft === 0 ? 'Full' : busyId === s.id ? 'Booking...' : 'Book'}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}