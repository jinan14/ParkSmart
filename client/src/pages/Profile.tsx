import { useAuth } from "../context/AuthContext";

export function Profile() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1>My Profile</h1>
      <p>Name: {user.fullName}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
