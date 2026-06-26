import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, CalendarCheck2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Backend not connected — this is a frontend demo.');
    } finally {
      setLoading(false);
    }
  };

  const googleDemo = async () => {
    try {
      await loginWithGoogle('demo-credential');
      navigate('/dashboard');
    } catch {
      toast('Connect the backend + Google OAuth client ID to enable this.', { icon: '🔑' });
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-14">
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-glow">
          <CalendarCheck2 size={22} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-navy-600 dark:text-ice/60">Log in to manage your appointments.</p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-navy-600 dark:text-ice/60"><Mail size={14} /> Email</span>
          <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-navy-600 dark:text-ice/60"><Lock size={14} /> Password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="input !pr-11"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 dark:text-ice/40 dark:hover:text-ice/80"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Logging in...' : 'Log In'}</button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs text-navy-400">
        <span className="h-px flex-1 bg-navy-900/10 dark:bg-white/10" /> OR <span className="h-px flex-1 bg-navy-900/10 dark:bg-white/10" />
      </div>

      <button onClick={googleDemo} className="btn-secondary w-full">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="h-4 w-4" />
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-navy-600 dark:text-ice/60">
        New here? <Link to="/register" className="font-semibold text-brand-500">Create an account</Link>
      </p>
    </div>
  );
}
