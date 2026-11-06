import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BookingCard from '../components/BookingCard';

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    api('/api/bookings')
      .then((data) => setBookings(data.bookings))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  async function cancel(id) {
    if (!window.confirm('Cancel this booking?')) return;
    setError('');
    setCancellingId(id);
    try {
      await api(`/api/bookings/${id}/cancel`, { method: 'PATCH' });
    } catch (err) {
      setError(err.message);
    } finally {
      setCancellingId(null);
      setReloadKey((k) => k + 1);
    }
  }

  const now = new Date();
  const withSession = bookings.filter((b) => b.sessionId);
  const upcoming = withSession
    .filter((b) => b.status === 'confirmed' && new Date(b.sessionId.startsAt) > now)
    .sort((a, b) => new Date(a.sessionId.startsAt) - new Date(b.sessionId.startsAt));
  const earlier = withSession.filter((b) => !upcoming.includes(b));

  return (
    <main className="page">
      <h1>Hello, {user.name}</h1>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="error" role="alert">{error}</p>}

      {!loading && (
        <>
          <h2>Upcoming sessions</h2>
          {upcoming.length === 0 ? (
            <p>Nothing booked yet. <Link to="/services">Browse services</Link> to find a session.</p>
          ) : (
            <ul className="session-list">
              {upcoming.map((b) => (
                <BookingCard key={b._id} booking={b} onCancel={cancel} cancelling={cancellingId === b._id} />
              ))}
            </ul>
          )}

          {earlier.length > 0 && (
            <>
              <h2>Past and cancelled</h2>
              <ul className="session-list">
                {earlier.map((b) => <BookingCard key={b._id} booking={b} />)}
              </ul>
            </>
          )}
        </>
      )}
    </main>
  );
}