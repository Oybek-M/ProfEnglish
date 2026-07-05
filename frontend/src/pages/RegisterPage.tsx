import { useState, type FormEvent } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="p-8 text-center">Yuklanmoqda...</div>;
  if (user) return <Navigate to="/dashboard" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await register(email, password);
      navigate('/onboarding');
    } catch (err) {
      setError("Ro'yxatdan o'tishda xatolik (email band bo'lishi mumkin)");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 via-gray-50 to-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <Link to="/" className="inline-block">
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent block mb-1">
              ProfEnglish
            </span>
            <span className="text-xs text-gray-400 hover:text-gray-600 transition">
              ← Bosh sahifa
            </span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-900">Hisob yarating</h2>
          <p className="text-sm text-gray-500 text-center mt-1 mb-6">Kasbingizga mos dars bilan boshlang</p>

          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
          )}

          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="siz@misol.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
          <div className="relative mb-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              placeholder="Kamida 6 belgi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              minLength={6}
              required
            />
          </div>
          <p className="text-xs text-gray-400 mb-6">Kamida 6 ta belgidan iborat bo'lishi kerak</p>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Ro'yxatdan o'tish
          </button>

          <p className="text-sm text-center mt-6 text-gray-600">
            Akkountingiz bormi?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-700">
              Kiring
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
