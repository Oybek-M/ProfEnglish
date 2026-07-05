import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import type { LevelTestQuestion } from '../types';

const PROFESSIONS = [
  { id: 'it', label: 'IT / Dasturlash' },
  { id: 'business', label: 'Business' },
];

function ProfessionIcon({ id }: { id: string }) {
  if (id === 'it') {
    return (
      <svg className="w-9 h-9 mx-auto text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    );
  }
  return (
    <svg className="w-9 h-9 mx-auto text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2v-8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
  );
}

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

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState('');
  const [questions, setQuestions] = useState<LevelTestQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [goal, setGoal] = useState('');
  const [targetLevel, setTargetLevel] = useState('');
  const [preTestPhase, setPreTestPhase] = useState<'ask' | 'confirm' | 'test'>('ask');
  const [selfAssessedLevel, setSelfAssessedLevel] = useState('');
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
    if (!goal || !targetLevel) {
      setError('Maqsad va maqsadiy darajani tanlang');
      return;
    }
    try {
      const res = await api.completeOnboarding(profession, answers, goal, targetLevel);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PROFESSIONS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProfession(p.id)}
                  className={`p-6 rounded-xl border-2 text-center ${
                    profession === p.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="mb-2"><ProfessionIcon id={p.id} /></div>
                  <div className="font-semibold">{p.label}</div>
                </button>
              ))}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center opacity-75 cursor-not-allowed">
                <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <div className="font-semibold text-gray-700 mb-1">Ko'p kasb sohalari</div>
                <div className="text-sm text-gray-600 mb-2">Sog'liq, Marketing, Huquq, Tahlil va boshqa</div>
                <div className="text-xs font-semibold text-gray-500">Tez kunda</div>
              </div>
            </div>
            <button
              disabled={!profession}
              onClick={() => {
                setPreTestPhase('ask');
                setSelfAssessedLevel('');
                setStep(2);
              }}
              className="mt-8 w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold"
            >
              Keyingisi
            </button>
          </div>
        )}

        {step === 2 && preTestPhase === 'ask' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Ingliz tilida o'zingizni qanday darajada deb hisobayapsiz?</h2>
            <div className="space-y-3 mb-8">
              {[
                { id: 'dontknow', label: 'Bilmayman' },
                { id: 'a1-a2', label: 'A1-A2 (Boshlang\'ich)' },
                { id: 'b1', label: 'B1 (O\'rta)' },
                { id: 'b2', label: 'B2 (Yuqori o\'rta)' },
                { id: 'c1-c2', label: 'C1-C2 (Ilg\'or)' },
              ].map((level) => (
                <button
                  key={level.id}
                  onClick={() => {
                    setSelfAssessedLevel(level.id);
                    if (level.id === 'dontknow') {
                      setPreTestPhase('test');
                    } else {
                      setPreTestPhase('confirm');
                    }
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition ${
                    selfAssessedLevel === level.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium text-gray-900">{level.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && preTestPhase === 'confirm' && selfAssessedLevel && (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              Siz {
                selfAssessedLevel === 'a1-a2' ? 'A1-A2' :
                selfAssessedLevel === 'b1' ? 'B1' :
                selfAssessedLevel === 'b2' ? 'B2' :
                'C1-C2'
              } darajasida ekanligingizdan ishonchli?
            </h2>
            <p className="text-gray-600 mb-8">
              Aniqlanish uchun qisqa test o'tishing mumkin. Hammasi juda sodda!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => setPreTestPhase('test')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
              >
                Ha, testni o'tib davom et →
              </button>
              <button
                onClick={() => {
                  setPreTestPhase('ask');
                  setSelfAssessedLevel('');
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition"
              >
                Aniqlansin ← (Xo'p, shuning uchun test kerak)
              </button>
            </div>
          </div>
        )}

        {step === 2 && preTestPhase === 'test' && (
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

            <div className="mb-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">Nima uchun o'rganyapsiz?</p>
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
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Maqsadiy darajangiz qaysi?</p>
              <div className="grid grid-cols-2 gap-3">
                {TARGET_LEVELS.map((tl) => (
                  <button
                    key={tl.id}
                    onClick={() => setTargetLevel(tl.id)}
                    className={`px-3 py-2 rounded-lg border-2 text-sm text-left transition ${
                      targetLevel === tl.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{tl.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
            <button
              disabled={!goal || !targetLevel}
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
