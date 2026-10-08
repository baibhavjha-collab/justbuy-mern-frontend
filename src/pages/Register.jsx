import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [busy, setBusy] = useState(false);

  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);

    try {
      await register(form);
      nav('/');
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Unable to create account. Please try again.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-card">
        <span className="eyebrow">JUSTBUY</span>

        <h1>Create your account</h1>

        <p>Start shopping in seconds.</p>

        <form onSubmit={submit}>
          <label>
            Full name

            <input
              required
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </label>

          <label>
            Email

            <input
              required
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </label>

          <label>
            Password

            <input
              required
              minLength="6"
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </label>

          <button className="btn full" disabled={busy}>
            {busy ? 'Please wait...' : 'Create account'}
          </button>
        </form>

        <p>
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}