import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { Lesson } from '../types';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.profession) {
      navigate('/onboarding');
      return;
    }
    api
      .getCurrentLesson()
      .then((res) => setLesson(res.lesson))
      .catch(() => setError('Dars generatsiyasida xatolik yuz berdi'))
      .finally(() => setLoading(false));
  }, [user]);

  function goToLesson() {
    if (lesson) {
      sessionStorage.setItem('current_lesson', JSON.stringify(lesson));
      navigate('/lesson');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        {loading && (
          <>
            <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600">AI shaxsiy darsingizni tayyorlamoqda...</p>
          </>
        )}
        {!loading && error && <p className="text-red-600">{error}</p>}
        {!loading && lesson && (
          <>
            <h2 className="text-xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-gray-600 mb-6">{lesson.goalSentence}</p>
            <button
              onClick={goToLesson}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold"
            >
              Darsni boshlash
            </button>
          </>
        )}
      </div>
    </div>
  );
}
