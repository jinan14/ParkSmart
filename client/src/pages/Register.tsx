import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ApiError } from "../api/client";
import type { Role } from "../types/user";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<Extract<Role, "DRIVER" | "OWNER">>("DRIVER");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        fullName,
        email,
        password,
        phone: phone || undefined,
        role,
        businessName: role === "OWNER" ? businessName : undefined,
      });
      navigate("/");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <label>
          Phone (optional)
          <input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>

        <fieldset>
          <legend>I am a...</legend>
          <label className="radio-label">
            <input
              type="radio"
              name="role"
              value="DRIVER"
              checked={role === "DRIVER"}
              onChange={() => setRole("DRIVER")}
            />
            Driver
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="role"
              value="OWNER"
              checked={role === "OWNER"}
              onChange={() => setRole("OWNER")}
            />
            Parking Owner
          </label>
        </fieldset>

        {role === "OWNER" && (
          <label>
            Business name
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />
          </label>
        )}

        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
