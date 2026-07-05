import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson, EvaluationResult } from '../types';
import { api } from '../api/client';

const BLOCKS = ['info', 'vocab', 'exercises', 'chat', 'final', 'review'];

export default function LessonPage() {
  const navigate = useNavigate();
  const stored = sessionStorage.getItem('current_lesson');
  let lesson: Lesson | null = null;
  if (stored) {
    try {
      lesson = JSON.parse(stored);
    } catch {
      lesson = null;
    }
  }

  const [block, setBlock] = useState(0);
  const [exerciseAnswers, setExerciseAnswers] = useState<string[]>(
    lesson ? new Array(lesson.exercises.length).fill('') : []
  );
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const [finalAnswer, setFinalAnswer] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [evalError, setEvalError] = useState('');

  const sendChatMessage = async () => {
    const trimmed = chatInput.trim();
    if (!trimmed || chatLoading || !lesson) return;

    setChatError('');
    setChatLoading(true);

    try {
      // Optimistically append user message
      const userMessage = { role: 'user' as const, content: trimmed };
      setChatHistory((prev) => [...prev, userMessage]);
      setChatInput('');

      // Call API with history BEFORE the new message
      const response = await api.sendChatMessage(lesson.cacheKey, chatHistory, trimmed);

      // Append assistant reply
      const assistantMessage = { role: 'assistant' as const, content: response.reply };
      setChatHistory((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setChatError(`Xatolik yuz berdi: ${errorMsg}`);
      // Remove the optimistically added user message on error
      setChatHistory((prev) => prev.slice(0, -1));
      setChatInput(trimmed);
    } finally {
      setChatLoading(false);
    }
  };

  const submitFinalAnswer = async () => {
    const trimmed = finalAnswer.trim();
    if (!trimmed || evalLoading || !lesson) return;

    setEvalError('');
    setEvalLoading(true);

    try {
      const response = await api.submitEvaluation(lesson.cacheKey, trimmed);
      setEvaluation(response.evaluation);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setEvalError(`Xatolik yuz berdi: ${errorMsg}. Qayta urinib ko'ring.`);
    } finally {
      setEvalLoading(false);
    }
  };

  if (!lesson) {
    return (
      <div className="p-8 text-center">
        <p>Dars topilmadi.</p>
        <button type="button" onClick={() => navigate('/dashboard')} className="text-indigo-600 mt-4">
          Dashboard'ga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between mb-6">
          {BLOCKS.map((b, i) => (
            <div key={b} className={`h-1.5 flex-1 mx-0.5 rounded ${i <= block ? 'bg-indigo-600' : 'bg-gray-200'}`} />
          ))}
        </div>

        {BLOCKS[block] === 'info' && (
          <div>
            <h2 className="text-2xl font-bold mb-2">{lesson.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{lesson.durationMinutes} daqiqa · Ko'nikma: {lesson.skill}</p>
            <div className="bg-indigo-50 p-4 rounded-lg mb-4">
              <p className="font-semibold mb-1">Missiya:</p>
              <p>{lesson.mission}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold mb-1">Vaziyat:</p>
              <p>{lesson.scenario}</p>
            </div>
            <button type="button" onClick={() => setBlock(1)} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
              Davom etish
            </button>
          </div>
        )}

        {BLOCKS[block] === 'vocab' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Yangi so'z va iboralar</h3>
            <div className="grid gap-3 mb-6">
              {lesson.vocabulary.map((v, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <p className="font-semibold">{v.word} <span className="text-gray-400 font-normal">{v.transcription}</span></p>
                  <p className="text-sm text-gray-600">{v.meaningUz}</p>
                  <p className="text-sm italic text-gray-500">"{v.example}"</p>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-bold mb-4">Tayyor iboralar</h3>
            <div className="grid gap-3">
              {lesson.phrases.map((p, i) => (
                <div key={i} className="border rounded-lg p-3">
                  <p className="font-semibold">{p.phrase}</p>
                  <p className="text-sm text-gray-600">{p.usage}</p>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setBlock(2)} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
              Mashqlarga o'tish
            </button>
          </div>
        )}

        {BLOCKS[block] === 'exercises' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Interaktiv mashqlar</h3>
            <div className="space-y-6">
              {lesson.exercises.map((ex, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <p className="font-medium mb-3">{i + 1}. {ex.question}</p>
                  <div className="grid gap-2">
                    {ex.options.map((opt, oi) => (
                      <button
                        key={oi}
                        onClick={() => {
                          const next = [...exerciseAnswers];
                          next[i] = opt;
                          setExerciseAnswers(next);
                        }}
                        className={`text-left px-3 py-2 rounded border ${
                          exerciseAnswers[i] === opt
                            ? opt === ex.correctAnswer
                              ? 'border-green-600 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : 'border-gray-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setBlock(3)} className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
              AI suhbatga o'tish
            </button>
          </div>
        )}

        {BLOCKS[block] === 'chat' && (
          <div>
            <h3 className="text-xl font-bold mb-2">AI bilan rol-o'yin suhbat</h3>
            <p className="text-sm text-gray-500 mb-4">Rol: {lesson.roleplayCharacter}</p>
            <div className="border rounded-lg p-4 h-72 overflow-y-auto mb-4 bg-gray-50 space-y-3">
              <div className="text-left">
                <span className="inline-block bg-indigo-100 px-3 py-2 rounded-lg">{lesson.roleplayOpeningLine}</span>
              </div>
              {chatHistory.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <span className={`inline-block px-3 py-2 rounded-lg ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-indigo-100'}`}>
                    {m.content}
                  </span>
                </div>
              ))}
              {chatLoading && <p className="text-sm text-gray-400">Yozmoqda...</p>}
            </div>
            {chatError && <p className="text-red-600 text-sm mb-2">{chatError}</p>}
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Inglizcha yozing..."
                className="flex-1 border rounded-lg px-4 py-2"
              />
              <button type="button" onClick={sendChatMessage} className="bg-indigo-600 text-white px-4 rounded-lg">
                Yuborish
              </button>
            </div>
            <button type="button" onClick={() => setBlock(4)} className="mt-6 w-full bg-gray-200 py-3 rounded-lg font-semibold">
              Yakuniy sinovga o'tish
            </button>
          </div>
        )}

        {BLOCKS[block] === 'final' && (
          <div>
            <h3 className="text-xl font-bold mb-2">Yakuniy sinov</h3>
            <p className="text-sm text-gray-600 mb-4">{lesson.finalTaskPrompt}</p>
            <textarea
              value={finalAnswer}
              onChange={(e) => setFinalAnswer(e.target.value)}
              rows={6}
              placeholder="Javobingizni inglizcha yozing..."
              className="w-full border rounded-lg px-4 py-3 mb-4"
            />
            {!evaluation && (
              <>
                {evalError && <p className="text-red-600 text-sm mb-2">{evalError}</p>}
                <button
                  type="button"
                  onClick={submitFinalAnswer}
                  disabled={evalLoading || !finalAnswer.trim()}
                  className="w-full bg-indigo-600 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold"
                >
                  {evalLoading ? 'Baholanmoqda...' : 'Yuborish va baho olish'}
                </button>
              </>
            )}
            {evaluation && (
              <div className="mt-4 space-y-2">
                <p className="font-bold text-lg">Umumiy ball: {evaluation.overallScore}/10</p>
                {Object.entries(evaluation.scores).map(([key, val]) => (
                  <div key={key} className="flex justify-between text-sm border-b py-1">
                    <span>{key}</span>
                    <span className="font-semibold">{val}/10</span>
                  </div>
                ))}
                <p className="bg-indigo-50 p-3 rounded-lg mt-3">{evaluation.feedbackUz}</p>
                <button type="button" onClick={() => setBlock(5)} className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
                  Yakunlash
                </button>
              </div>
            )}
          </div>
        )}

        {BLOCKS[block] === 'review' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Takrorlash uchun</h3>
            <p className="font-semibold mb-2">So'zlar:</p>
            <p className="text-gray-600 mb-4">{lesson.reviewWords.join(', ')}</p>
            <p className="font-semibold mb-2">Iboralar:</p>
            <p className="text-gray-600 mb-6">{lesson.reviewPhrases.join(', ')}</p>
            <button type="button" onClick={() => navigate('/result')} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold">
              Natijani ko'rish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
