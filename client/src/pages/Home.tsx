import { useAuth } from "../context/AuthContext";

export function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>ParkSmart</h1>
      {user ? (
        <p>
          Welcome back, {user.fullName} ({user.role.toLowerCase()}).
        </p>
      ) : (
        <p>Find and reserve parking spaces in real time. Log in or register to get started.</p>
      )}
    </div>
  );
}
