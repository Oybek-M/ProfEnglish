import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lesson } from '../types';

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

        {BLOCKS[block] === 'chat' && <div className="p-4 text-center text-gray-400">Chat blok — Task 16 da qo'shiladi</div>}
        {BLOCKS[block] === 'final' && <div className="p-4 text-center text-gray-400">Yakuniy sinov blok — Task 16 da qo'shiladi</div>}
        {BLOCKS[block] === 'review' && <div className="p-4 text-center text-gray-400">Review blok — Task 16 da qo'shiladi</div>}
      </div>
    </div>
  );
}
