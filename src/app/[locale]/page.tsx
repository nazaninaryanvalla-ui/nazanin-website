import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';

function HeroSection() {
  const t = useTranslations('hero');
  const locale = useLocale();

  return (
    <section className="bg-[#1A3A6B] text-white min-h-screen flex items-center">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-[#F0C040] text-sm font-semibold tracking-widest uppercase mb-4">
            Nazanin — AI Consultant | AI-konsult
          </p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
            {t('title')}
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F0C040] leading-tight mb-8">
            {t('subtitle')}
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mb-10 leading-relaxed">
            {t('description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={`/${locale}/services`}
              className="bg-[#F0C040] text-[#1A3A6B] px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors text-center"
            >
              {t('cta')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-[#1A3A6B] transition-colors text-center"
            >
              {t('learnMore')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesPreview() {
  const t = useTranslations('services');
  const locale = useLocale();

  return (
    <section className="py-20 bg-[#E8F0FF]">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-[#1A3A6B] mb-12 text-center">
          {t('title')}
        </h2>
        <div className="grid md:grid-cols-1 gap-8 max-w-xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E0E0] hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-[#1A3A6B] rounded-xl flex items-center justify-center mb-6">
              <span className="text-[#F0C040] text-2xl">★</span>
            </div>
            <h3 className="text-xl font-bold text-[#1A3A6B] mb-3">
              {t('consultation.title')}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t('consultation.description')}
            </p>
            <div className="flex gap-3 mb-6">
              <span className="bg-[#E8F0FF] text-[#1A3A6B] px-3 py-1 rounded-full text-sm font-medium">
                {t('consultation.duration30')}
              </span>
              <span className="bg-[#E8F0FF] text-[#1A3A6B] px-3 py-1 rounded-full text-sm font-medium">
                {t('consultation.duration60')}
              </span>
            </div>
            <Link
              href={`/${locale}/services`}
              className="block bg-[#1A3A6B] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#3A6ABB] transition-colors"
            >
              {t('consultation.bookNow')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreview />
    </>
  );
}
