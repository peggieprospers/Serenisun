import { useEffect, useState } from 'react';
import { api } from '../services/api';
import ServiceCard from '../components/serviceCard';

export default function Services() {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (type) params.set('type', type);
    if (maxDuration) params.set('maxDuration', maxDuration);

    setLoading(true);
    setError('');
    api(`/api/services?${params}`)
      .then((data) => setServices(data.services))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, type, maxDuration]);

  return (
    <main className="page">
      <h1>Services</h1>

      <div className="filters">
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          <option value="yoga">Yoga</option>
          <option value="meditation">Meditation</option>
        </select>
        <select aria-label="Type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Group or 1:1</option>
          <option value="group">Group</option>
          <option value="one-on-one">1:1</option>
        </select>
        <select aria-label="Duration" value={maxDuration} onChange={(e) => setMaxDuration(e.target.value)}>
          <option value="">Any length</option>
          <option value="30">30 min or less</option>
          <option value="60">60 min or less</option>
        </select>
      </div>

      {loading && <p className="status">Loading...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!loading && !error && services.length === 0 && <p>No services match those filters.</p>}

      <div className="card-grid">
        {services.map((s) => <ServiceCard key={s._id} service={s} />)}
      </div>
    </main>
  );
}