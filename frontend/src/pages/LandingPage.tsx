import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">ProfEnglish</h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        Kasbingizga mos ingliz tilini sun'iy intellekt yordamida shaxsiylashtirilgan tarzda o'rganing.
      </p>
      <Link
        to="/register"
        className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
      >
        Bepul boshlash
      </Link>
    </div>
  );
}
