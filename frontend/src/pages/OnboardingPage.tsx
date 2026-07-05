import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { LevelTestQuestion } from '../types';

const PROFESSIONS = [
  { id: 'it', label: 'IT / Dasturlash', icon: '💻' },
  { id: 'business', label: 'Business', icon: '💼' },
];

const GOALS = [
  { id: 'job', label: 'Ishga kirish' },
  { id: 'clients', label: 'Xalqaro mijozlar bilan ishlash' },
  { id: 'ielts', label: 'IELTS / imtihon' },
  { id: 'career', label: "Karyera o'sishi" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState('');
  const [questions, setQuestions] = useState<LevelTestQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.getLevelTest().then((res) => {
      setQuestions(res.questions);
      setAnswers(new Array(res.questions.length).fill(-1));
    });
  }, []);

  function selectAnswer(qIndex: number, optionIndex: number) {
    const next = [...answers];
    next[qIndex] = optionIndex;
    setAnswers(next);
  }

  async function finishOnboarding() {
    setError('');
    if (answers.some((a) => a === -1)) {
      setError('Barcha savollarga javob bering');
      return;
    }
    try {
      const res = await api.completeOnboarding(profession, answers, goal);
      setUser(res.user);
      navigate('/dashboard');
    } catch (err) {
      setError("Xatolik yuz berdi, qayta urinib ko'ring");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-2 flex-1 mx-1 rounded ${s <= step ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Kasbingizni tanlang</h2>
            <div className="grid grid-cols-2 gap-4">
              {PROFESSIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfession(p.id)}
                  className={`p-6 rounded-xl border-2 text-center ${
                    profession === p.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="text-4xl mb-2">{p.icon}</div>
                  <div className="font-semibold">{p.label}</div>
                </button>
              ))}
            </div>
            <button
              disabled={!profession}
              onClick={() => setStep(2)}
              className="mt-8 w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold"
            >
              Keyingisi
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Daraja aniqlovchi test</h2>
            <div className="space-y-6">
              {questions.map((q, qIndex) => (
                <div key={q.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-medium mb-3">{qIndex + 1}. {q.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, optIndex) => (
                      <button
                        key={optIndex}
                        onClick={() => selectAnswer(qIndex, optIndex)}
                        className={`px-3 py-2 rounded border text-sm text-left ${
                          answers[qIndex] === optIndex ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            <button
              disabled={answers.some((a) => a === -1)}
              onClick={() => setStep(3)}
              className="mt-8 w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold"
            >
              Keyingisi
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Maqsadingiz nima?</h2>
            <div className="space-y-3">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 ${
                    goal === g.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            <button
              disabled={!goal}
              onClick={finishOnboarding}
              className="mt-8 w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold"
            >
              Yakunlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
