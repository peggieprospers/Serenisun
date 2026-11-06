import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="hero">
      <h1>Serenisun</h1>
      <p className="tagline">Expand your inner radiance.</p>
      <p>
        Book live yoga and meditation sessions with real instructors, and let a gentle AI
        guide help you find the right one.
      </p>
      <Link to="/register" className="btn">Get started</Link>
    </main>
  );
}