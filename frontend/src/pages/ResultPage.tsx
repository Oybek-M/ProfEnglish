import { Link } from 'react-router-dom';

export default function ResultPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg className="w-9 h-9 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2">Tabriklaymiz!</h2>
        <p className="text-gray-600 mb-6">Siz birinchi darsingizni muvaffaqiyatli yakunladingiz.</p>
        <Link to="/dashboard" className="w-full inline-block bg-indigo-600 text-white py-3 rounded-lg font-semibold">
          Dashboard'ga qaytish
        </Link>
      </div>
    </div>
  );
}
