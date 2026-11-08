import { Link } from 'react-router-dom';
import { formatTime } from '../utils/format';
import { typeLabel } from './ServiceCard';

export default function BookingCard({ booking, onCancel, cancelling }) {
  const session = booking.sessionId;
  const service = session && session.serviceId;
  if (!session || !service) return null; // the session was removed from the database

  const upcoming = booking.status === 'confirmed' && new Date(session.startsAt) > new Date();

  return (
    <li className="session">
      <div>
        <strong>{service.name}</strong>
        <div className="spots">
          {formatTime(session.startsAt)} · {typeLabel(service.type)} · {service.durationMinutes} min
        </div>
        <div className="spots">
          with {session.instructorId ? session.instructorId.name : 'your instructor'}
        </div>
        {booking.status === 'cancelled' && <div className="spots">Cancelled</div>}
        {upcoming && session.meetingLink && (
          <div className="spots">
            <a href={session.meetingLink} target="_blank" rel="noreferrer">Join online</a>
          </div>
        )}
        {booking.instructorNote && (
  <div className="note">
    <strong>Note for your instructor</strong>
    <p>{booking.instructorNote}</p>
  </div>
)}
      </div>

      {upcoming && (
        <div className="actions">
          <Link to={`/bookings/${booking._id}/reschedule`} className="btn">Reschedule</Link>
          <button
            className="btn btn-ghost"
            onClick={() => onCancel(booking._id)}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel'}
          </button>
        </div>
      )}
    </li>
  );
}