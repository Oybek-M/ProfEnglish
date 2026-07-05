import { Link } from 'react-router-dom';

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">Tabriklaymiz!</h2>
        <p className="text-gray-600 mb-6">Siz birinchi darsingizni muvaffaqiyatli yakunladingiz.</p>
        <Link to="/dashboard" className="w-full inline-block bg-indigo-600 text-white py-3 rounded-lg font-semibold">
          Dashboard'ga qaytish
        </Link>
      </div>
    </div>
  );
}
