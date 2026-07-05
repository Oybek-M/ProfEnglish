import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Lesson, EvaluationResult } from '../types';

interface ProgressItem {
  userId: string;
  lessonKey: string;
  finalAnswer: string;
  evaluation: EvaluationResult;
  completedAt: string;
}

const UZ_WEEKDAYS = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
const UZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
];

function formatUzDate(date: Date, withWeekday = true): string {
  const day = date.getDate();
  const month = UZ_MONTHS[date.getMonth()];
  return withWeekday ? `${UZ_WEEKDAYS[date.getDay()]}, ${day}-${month}` : `${day}-${month}`;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  function fetchLesson() {
    setLoading(true);
    setError('');
    api
      .getCurrentLesson()
      .then((res) => setLesson(res.lesson))
      .catch(() => setError('Dars generatsiyasida xatolik yuz berdi'))
      .finally(() => setLoading(false));
  }

  function fetchProgress() {
    api.getMyProgress().then((res) => setProgress(res.progress)).catch(() => {
      // Silently fail
    });
  }

  useEffect(() => {
    if (!user?.profession) {
      navigate('/onboarding');
      return;
    }
    fetchLesson();
    fetchProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.profession, user?.id]);

  function goToLesson() {
    if (lesson) {
      sessionStorage.setItem('current_lesson', JSON.stringify(lesson));
      navigate('/lesson');
    }
  }

  // Compute today's completed count
  const today = new Date().toDateString();
  const todayCompleted = progress.filter(
    (p) => new Date(p.completedAt).toDateString() === today
  ).length;

  if (loading && !lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">AI shaxsiy darsingizni tayyorlamoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Xush kelibsiz! 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">{formatUzDate(new Date())}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Chiqish</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-indigo-100">
            <p className="text-xs text-gray-600 font-semibold uppercase">Bugun dars</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {todayCompleted}/1
            </p>
          </div>

          {progress.length > 0 && (
            <>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
                <p className="text-xs text-gray-600 font-semibold uppercase">Jami darslar</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {progress.length}
                </p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-xs text-gray-600 font-semibold uppercase">O'rtacha ball</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {Math.round(
                    progress.reduce((sum, p) => sum + (p.evaluation?.overallScore || 0), 0) /
                      progress.length
                  )}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Today's Lesson (Hero) */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700 font-semibold mb-3">{error}</p>
            <button
              onClick={fetchLesson}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Qayta urinish
            </button>
          </div>
        )}

        {lesson && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold">
                  {user?.profession === 'it' ? '💻 IT' : '💼 Business'}
                </span>
                <span className="text-white/80 text-sm">
                  ⏱ {lesson.durationMinutes || 30} min
                </span>
              </div>
              <span className="text-white/80 text-sm font-semibold">
                Level: {user?.level?.toUpperCase() || 'A1'}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {lesson.title}
              </h2>
              <p className="text-gray-600 mb-6">
                {lesson.goalSentence}
              </p>

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                <p className="text-sm text-indigo-900">
                  <strong>Bu darsda:</strong> {lesson.mission || lesson.skill}
                </p>
              </div>

              <button
                onClick={goToLesson}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center space-x-2"
              >
                <span>Darsni boshlash</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Recent Progress */}
        {progress.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Oxirgi natijalar</h3>
            <div className="space-y-3">
              {progress
                .slice(-3)
                .reverse()
                .map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Dars #{progress.length - idx}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatUzDate(new Date(item.completedAt), false)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        {item.evaluation?.overallScore || '-'} / 10
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
