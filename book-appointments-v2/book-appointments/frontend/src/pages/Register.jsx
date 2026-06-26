import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Phone, CalendarCheck2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordMismatch = form.confirm && form.password !== form.confirm;

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { confirm, ...payload } = form;
      await register(payload);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch {
      toast.error('Backend not connected — this is a frontend demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-14">
      <div className="text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-glow">
          <CalendarCheck2 size={22} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-navy-600 dark:text-ice/60">Start booking appointments in seconds.</p>
      </div>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-navy-600 dark:text-ice/60"><User size={14} /> Full name</span>
          <input required className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jordan Smith" />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-navy-600 dark:text-ice/60"><Mail size={14} /> Email</span>
          <input type="email" required className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-navy-600 dark:text-ice/60"><Phone size={14} /> Phone</span>
          <input required className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9704860804" />
        </label>
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-navy-600 dark:text-ice/60"><Lock size={14} /> Password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              className="input !pr-11"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min. 8 characters"
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
        <label className="block">
          <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-navy-600 dark:text-ice/60"><Lock size={14} /> Confirm password</span>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              required
              className={`input !pr-11 ${passwordMismatch ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20' : ''}`}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600 dark:text-ice/40 dark:hover:text-ice/80"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {passwordMismatch && (
            <p className="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
          )}
        </label>
        <button type="submit" disabled={loading || passwordMismatch} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-navy-600 dark:text-ice/60">
        Already have an account? <Link to="/login" className="font-semibold text-brand-500">Log in</Link>
      </p>
    </div>
  );
}
