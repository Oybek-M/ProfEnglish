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
            <h1 className="text-3xl font-bold text-gray-900">Xush kelibsiz!</h1>
            <p className="text-sm text-gray-500 mt-1">{formatUzDate(new Date())}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Profil</span>
            </button>
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
                <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                  {user?.profession === 'it' ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                  {user?.profession === 'it' ? 'IT' : 'Biznes'}
                </span>
                <span className="text-white/80 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.durationMinutes || 30} min
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

              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
                <p className="text-sm text-indigo-900">
                  <strong>Bu darsda:</strong> {lesson.mission || lesson.skill}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {lesson.vocabulary.length} so'z, {lesson.phrases.length} ibora
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {lesson.exercises.length} mashq
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4v-4z" />
                  </svg>
                  AI rol-o'yin suhbat
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Yozma sinov + AI baholash
                </span>
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
