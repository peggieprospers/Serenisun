import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="hero">
      <h1>Serenisun</h1>
      <p className="tagline">Expand your inner radiance.</p>
      <p>
        Book live yoga and meditation sessions with real instructors, and let a gentle AI
        guide help you find the right one.
      </p>
      {user ? (
        <Link to="/services" className="btn">Find a session</Link>
      ) : (
        <Link to="/register" className="btn">Get started</Link>
      )}
    </main>
  );
}