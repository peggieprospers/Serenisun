import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { formatTime } from '../utils/format';

export default function RescheduleBooking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [movingId, setMovingId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // Find this booking among the user's bookings, then load its service's sessions
        const { bookings } = await api('/api/bookings');
        const found = bookings.find((b) => b._id === id && b.status === 'confirmed' && b.sessionId);
        if (!found) {
          setError('Booking not found.');
          return;
        }
        setBooking(found);
        const data = await api(`/api/services/${found.sessionId.serviceId._id}`);
        setSessions(data.sessions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function moveTo(sessionId) {
    setError('');
    setMovingId(sessionId);
    try {
      await api(`/api/bookings/${id}`, { method: 'PATCH', body: { sessionId } });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
      setMovingId(null);
    }
  }

  if (loading) return <p className="status">Loading...</p>;

  if (!booking) {
    return (
      <main className="page">
        <p className="error" role="alert">{error || 'Booking not found.'}</p>
        <Link to="/dashboard">← Back to dashboard</Link>
      </main>
    );
  }

  const current = booking.sessionId;
  const options = sessions.filter((s) => s.id !== current._id);

  return (
    <main className="page">
      <Link to="/dashboard" className="back-link">← Back to dashboard</Link>
      <h1>Reschedule</h1>
      <p>
        <strong>{current.serviceId.name}</strong>, currently {formatTime(current.startsAt)}
      </p>

      <h2>Choose a new time</h2>
      {error && <p className="error" role="alert">{error}</p>}
      {options.length === 0 && <p>No other upcoming times are available for this service yet.</p>}

      <ul className="session-list">
        {options.map((s) => (
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
              disabled={s.spotsLeft === 0 || movingId === s.id}
              onClick={() => moveTo(s.id)}
            >
              {s.spotsLeft === 0 ? 'Full' : movingId === s.id ? 'Moving...' : 'Move here'}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}