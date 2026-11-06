import { Link } from 'react-router-dom';

export const typeLabel = (type) => (type === 'group' ? 'Group' : '1:1');

export default function ServiceCard({ service }) {
  return (
    <Link to={`/services/${service._id}`} className="card">
      <h2>{service.name}</h2>
      <p className="meta">
        {typeLabel(service.type)} · {service.durationMinutes} min · {service.category}
      </p>
      <p>{service.description}</p>
    </Link>
  );
}