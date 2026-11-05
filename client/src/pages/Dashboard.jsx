import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <main className="page">
      <h1>Hello, {user.name}</h1>
      <p>Your upcoming sessions will appear here.</p>
    </main>
  );
}