import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { JSX } from 'react';

export default function LandingPage(): JSX.Element {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              ProfEnglish
            </h1>
            {/* Desktop nav */}
            <div className="hidden md:flex space-x-6">
              <a href="#imkoniyatlar" className="text-gray-600 hover:text-indigo-600 transition text-sm">
                Imkoniyatlar
              </a>
              <a href="#qanday-ishlaydi" className="text-gray-600 hover:text-indigo-600 transition text-sm">
                Qanday ishlaydi
              </a>
              <a href="#yonalishlar" className="text-gray-600 hover:text-indigo-600 transition text-sm">
                Yo'nalishlar
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-indigo-600 transition text-xs sm:text-sm font-medium px-2 py-1 sm:px-0"
            >
              Kirish
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-xs sm:text-sm font-semibold"
            >
              Bepul boshlash
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-indigo-600 transition p-2"
              title="Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <a href="#imkoniyatlar" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">
                Imkoniyatlar
              </a>
              <a href="#qanday-ishlaydi" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">
                Qanday ishlaydi
              </a>
              <a href="#yonalishlar" className="block px-3 py-2 text-gray-600 hover:text-indigo-600">
                Yo'nalishlar
              </a>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="block w-full text-left px-3 py-3 font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition border border-indigo-200"
              >
                Kirish
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-violet-900 to-fuchsia-900 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        {/* Gradient blobs */}
        <div className="absolute top-20 -right-32 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute -bottom-8 -left-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="z-10">
              <div className="inline-block mb-6 px-4 py-2 bg-white/10 rounded-full border border-white/20">
                <p className="text-white text-sm font-medium">AI yordamida ishlaydigan kasbiy ingliz tili platformasi</p>
              </div>

              <h1 className="text-5xl sm:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                Kasbga mos ingliz tilini o'rganing
              </h1>

              <p className="text-xl text-indigo-100 mb-8 max-w-lg leading-relaxed">
                Sun'iy intellekt har kuni sizga mos dars tayyorlaydi. Haqiqiy ish vaziyatlarida AI bilan suhbatlashing, yozma ishingizni baholat.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm">
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                  <p className="text-2xl font-bold text-white">2</p>
                  <p className="text-sm text-indigo-200 mt-1">Kasb yo'nalishi</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                  <p className="text-2xl font-bold text-white">AI</p>
                  <p className="text-sm text-indigo-200 mt-1">Shaxsiy o'qituvchi</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                  <p className="text-2xl font-bold text-white">A1–C2</p>
                  <p className="text-sm text-indigo-200 mt-1">Barcha darajalar</p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-bold text-lg"
                >
                  Bepul boshlash
                </button>
                <a
                  href="#qanday-ishlaydi"
                  className="px-8 py-4 bg-white/10 text-white rounded-lg hover:bg-white/20 transition font-bold text-lg border border-white/20"
                >
                  Qanday ishlashini ko'rish
                </a>
              </div>
            </div>

            {/* Right: Product preview card */}
            <div className="z-10 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm lg:max-w-none">
                {/* Product preview mockup card */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  {/* Card header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-white/40" />
                      <p className="text-white text-sm font-medium">IT Specialist</p>
                    </div>
                    <p className="text-indigo-200 text-xs">Level B2</p>
                  </div>

                  {/* Chat content */}
                  <div className="p-6 space-y-4 bg-gray-50 min-h-80">
                    {/* AI message */}
                    <div className="flex justify-start">
                      <div className="max-w-xs bg-indigo-100 rounded-lg rounded-tl-none px-4 py-3">
                        <p className="text-gray-800 text-sm">
                          "Good morning! Your team is asking you to present the quarterly report. How would you explain the main KPI changes to them?"
                        </p>
                      </div>
                    </div>

                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="max-w-xs bg-indigo-600 text-white rounded-lg rounded-tr-none px-4 py-3">
                        <p className="text-sm">
                          "We achieved 25% growth in the main metrics. Let me show you the details."
                        </p>
                      </div>
                    </div>

                    {/* AI response */}
                    <div className="flex justify-start">
                      <div className="max-w-xs bg-indigo-100 rounded-lg rounded-tl-none px-4 py-3">
                        <p className="text-gray-800 text-sm font-semibold mb-2">AI Baholash:</p>
                        <p className="text-gray-700 text-xs">Yaxshi! "achieved" va "metrics" so'zlarini to'g'ri ishlatdingiz. Shuning uchun +5 ball!</p>
                      </div>
                    </div>

                    {/* Score indicator */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                        <p className="text-white font-bold text-sm">+5</p>
                      </div>
                      <div>
                        <p className="text-gray-800 text-xs font-semibold">Bugungi ball</p>
                        <p className="text-gray-600 text-xs">Jami: 2,340 ball</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="imkoniyatlar" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Nima uchun ProfEnglish?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Oddiy kursdan farqli — kasbingizga moslashgan intellektual tizim
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">AI tomonidan shaxsiylashtirilgan darslar</h3>
              <p className="text-gray-600">
                Har bir dars sizning kasbingiz, darajangiz va maqsadingizga mos yaratiladi. Takroriy darslar emas, balki sizga kerak bo'lgan narsa.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Kasbiy rol-o'yin suhbatlar</h3>
              <p className="text-gray-600">
                Haqiqiy ish vaziyatlarida AI bilan muloqot mashqi qiling — suhbat, taqdimot va ish uchrashuvlariga tayyorlaning.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Yozma ishi AI baholaydi</h3>
              <p className="text-gray-600">
                Har bir yozma ishingiz uchun batafsil ball, xatolar tahlili va o'zbek tilida tushuntirilgan fikr-mulohaza olasiz.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Interaktiv mashqlar va lug'at</h3>
              <p className="text-gray-600">
                Har darsda yangi so'zlar va iboralar. Amaliy mashqlar bilan ularni memoriya qilib oling va keyin darsda qo'llang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="qanday-ishlaydi" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Qanday ishlaydi?</h2>
            <p className="text-xl text-gray-600">Uchta oddiy bosqichda boshlang</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                  <p className="text-white text-2xl font-bold">1</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Kasbingizni tanlang</h3>
              <p className="text-gray-600 text-center">
                IT yoki Biznes. Platformamiz sizning kasbga mos darslar tayyorlashni boshlaydi.
              </p>
              {/* Desktop connector line */}
              <div className="hidden md:block absolute top-1/4 right-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-transparent transform translate-x-full" />
              {/* Mobile connector line */}
              <div className="md:hidden absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-indigo-600 to-transparent" />
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                  <p className="text-white text-2xl font-bold">2</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Darajangizni aniqlang</h3>
              <p className="text-gray-600 text-center">
                Qisqa test orqali sizning ingliz tili darajangiz aniqlanadi. A1 dan C2 gacha.
              </p>
              {/* Desktop connector line */}
              <div className="hidden md:block absolute top-1/4 right-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-transparent transform translate-x-full" />
              {/* Mobile connector line */}
              <div className="md:hidden absolute top-full left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-indigo-600 to-transparent" />
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="flex items-center justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
                  <p className="text-white text-2xl font-bold">3</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Har kuni o'rganing</h3>
              <p className="text-gray-600 text-center">
                AI har kuni sizga mos dars tayyorlaydi. 30 minutlik darslar bilan birgalikda o'rganing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professions Section */}
      <section id="yonalishlar" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Yo'nalishlar</h2>
            <p className="text-xl text-gray-600">Kasbingizga mos darslarni tayyorlaydi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* IT */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-indigo-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">IT</h3>
              <p className="text-gray-600 text-center text-sm mb-4">
                Programmistlar, backend/frontend developers, QA muhandislari uchun
              </p>
              <p className="text-indigo-600 text-center font-semibold">✓ Faol</p>
            </div>

            {/* Biznes */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-8 border border-green-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Biznes</h3>
              <p className="text-gray-600 text-center text-sm mb-4">
                Menedzherlar, marketing mutaxassislari, sale va boshqa kasb sohalari
              </p>
              <p className="text-green-600 text-center font-semibold">✓ Faol</p>
            </div>

            {/* Coming Soon */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center opacity-75 hover:opacity-100 transition">
              <div className="w-12 h-12 bg-gray-400 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-700 text-center mb-2">Ko'p yo'nalishlar</h3>
              <p className="text-gray-600 text-center text-sm">
                Sog'liq, Marketing, Huquq, Tahlil va yana ko'plab yo'nalishlar tez orada
              </p>
              <p className="text-gray-500 text-center font-semibold mt-4 text-sm">Tez kunda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4">Tariflar</h2>
            <p className="text-xl text-gray-600">Barcha o'quvchilar uchun to'liq imkoniyatlar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Bepul</h3>
              <p className="text-gray-600 mb-6">Hozirda mavjud</p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Har kun yangi AI dars</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">AI bilan rol-o'yin suhbati</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Yozma baholash</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Lug'at va mashqlar</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate('/register')}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
              >
                Bepul boshlash
              </button>
            </div>

            {/* Pro Tier (Coming Soon) */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-8 border border-indigo-200 shadow-md relative overflow-hidden">
              <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Tez kunda
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-gray-600 mb-6">Qo'shimcha imkoniyatlar bilan</p>

              <div className="space-y-4 mb-8 opacity-60">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Cheksiz statistika va tahlil</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Ustuvor qo'llab-quvvatlash</span>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Maxsus moslashtirilgan darslar</span>
                </div>
              </div>

              <button
                type="button"
                disabled
                className="w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-lg cursor-not-allowed font-semibold border-2 border-gray-400"
              >
                Tez kunda ▸
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
            Bugun bepul boshlash
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            IT va Biznes soha vakillari uchun maxsus yaratilgan — kasbingizga mos birinchi darsingizni hoziroq boshlang.
          </p>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="px-10 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-bold text-lg"
          >
            Bepul boshlash
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-2">ProfEnglish</h3>
              <p className="text-sm">AI yordamida kasbiy ingliz tilini o'rganing</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Havolalar</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#imkoniyatlar" className="hover:text-white transition">Imkoniyatlar</a></li>
                <li><a href="#qanday-ishlaydi" className="hover:text-white transition">Qanday ishlaydi</a></li>
                <li><a href="#yonalishlar" className="hover:text-white transition">Yo'nalishlar</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hisob</h4>
              <ul className="space-y-2 text-sm">
                <li><button type="button" onClick={() => navigate('/login')} className="hover:text-white transition">Kirish</button></li>
                <li><button type="button" onClick={() => navigate('/register')} className="hover:text-white transition">Ro'yxatdan o'tish</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm">© 2026 ProfEnglish. Barcha huquqlar himoyalangan.</p>
            <p className="text-sm text-gray-500 mt-4 sm:mt-0">Kasb egalari uchun AI yordamida yaratildi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
