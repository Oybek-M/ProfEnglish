import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { User } from '../types';

const GOALS = [
  { id: 'job', label: 'Ishga kirish' },
  { id: 'clients', label: 'Xalqaro mijozlar bilan ishlash' },
  { id: 'ielts', label: 'IELTS / imtihon' },
  { id: 'career', label: "Karyera o'sishi" },
];

const TARGET_LEVELS = [
  { id: 'a1', label: "A1 - Boshlang'ich" },
  { id: 'a2', label: 'A2 - Elementar' },
  { id: 'b1', label: "B1 - O'rta" },
  { id: 'b2', label: "B2 - Yuqori o'rta" },
  { id: 'c1', label: "C1 - Ilg'or" },
  { id: 'c2', label: 'C2 - Ustoz' },
];

function getProfessionLabel(id: string | null): string {
  if (id === 'it') return 'IT / Dasturlash';
  if (id === 'business') return 'Biznes';
  return '-';
}

function getGoalLabel(id: string | null): string {
  const goal = GOALS.find((g) => g.id === id);
  return goal ? goal.label : '-';
}

function getTargetLevelLabel(id: string | null): string {
  const level = TARGET_LEVELS.find((l) => l.id === id);
  return level ? level.label : '-';
}

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    setError('');
    setSuccess('');
    setLoading(true);

    const updateObject: Partial<Pick<User, 'firstName' | 'lastName' | 'gender' | 'birthDate'>> = {};

    if (firstName.trim()) {
      updateObject.firstName = firstName.trim();
    }
    if (lastName.trim()) {
      updateObject.lastName = lastName.trim();
    }
    if (gender) {
      updateObject.gender = gender as 'male' | 'female' | 'other';
    }
    if (birthDate) {
      updateObject.birthDate = birthDate;
    }

    try {
      const res = await api.updateProfile(updateObject);
      setUser(res.user);
      setSuccess('Saqlandi!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Xatolik yuz berdi';
      if (errorMsg === 'INVALID_INPUT') {
        setError('Ism va familiya 50 ta belgidan ko\'zi bo\'lmasligi kerak');
      } else if (errorMsg === 'INVALID_GENDER') {
        setError('Jinsni to\'g\'ri tanlang');
      } else if (errorMsg === 'INVALID_BIRTHDATE') {
        setError('Tug\'ilish sanasi noto\'g\'ri. 10-100 yoshli bo\'lishingiz kerak');
      } else {
        setError('Profil yangilanishida xatolik');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center space-x-1 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Dashboard'ga qaytish</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Mening profil</h1>
          <p className="text-gray-600 mt-1">Hisobingizni o'zingiz o'rnatish va tahrirlash</p>
        </div>

        {/* Account Info Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Hisobingiz</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Email</p>
              <p className="text-gray-900 font-medium mt-1">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Kasbi</p>
              <p className="text-gray-900 font-medium mt-1">{getProfessionLabel(user?.profession || null)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Joriy daraja</p>
              <p className="text-gray-900 font-medium mt-1">{user?.level?.toUpperCase() || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Maqsad</p>
              <p className="text-gray-900 font-medium mt-1">{getGoalLabel(user?.goal || null)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase">Maqsadiy daraja</p>
              <p className="text-gray-900 font-medium mt-1">{getTargetLevelLabel(user?.targetLevel || null)}</p>
            </div>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Shaxsiy ma'lumotlarni tahrir qilish</span>
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-700 text-sm font-medium">{success}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
              <input
                type="text"
                placeholder="Masalan: Muhammad"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Familiya</label>
              <input
                type="text"
                placeholder="Masalan: Allayarov"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Jinsi</label>
              <div className="flex space-x-3">
                {[
                  { value: 'male', label: 'Erkak' },
                  { value: 'female', label: 'Ayol' },
                  { value: 'other', label: 'Boshqa' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setGender(gender === opt.value ? '' : opt.value)}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition ${
                      gender === opt.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tug'ilish sanasi</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                <span>Saqlanmoqda...</span>
              </>
            ) : (
              <span>Saqlash</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
