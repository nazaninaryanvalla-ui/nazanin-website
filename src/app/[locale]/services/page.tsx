import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function ServicesPage() {
  const t = useTranslations('services');
  const locale = useLocale();

  return (
    <section className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#F0C040] text-sm font-semibold tracking-widest uppercase mb-3">
            Services / Tjänster / خدمات
          </p>
          <h1 className="text-4xl font-bold text-[#1A3A6B] mb-4">{t('title')}</h1>
        </div>

        <div className="grid gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E0E0E0]">
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 bg-[#1A3A6B] rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-[#F0C040] text-2xl">★</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#1A3A6B] mb-3">
                  {t('consultation.title')}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {t('consultation.description')}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#E8F0FF] rounded-xl p-4 border border-[#3A6ABB]/20">
                    <p className="text-[#1A3A6B] font-semibold mb-1">{t('consultation.duration30')}</p>
                    <p className="text-3xl font-bold text-[#1A3A6B]">—</p>
                    <p className="text-gray-500 text-sm mt-1">Price TBD</p>
                  </div>
                  <div className="bg-[#1A3A6B] rounded-xl p-4 text-white">
                    <p className="text-[#F0C040] font-semibold mb-1">{t('consultation.duration60')}</p>
                    <p className="text-3xl font-bold">—</p>
                    <p className="text-blue-200 text-sm mt-1">Price TBD</p>
                  </div>
                </div>
                <Link
                  href={`/${locale}/services/book`}
                  className="block bg-[#F0C040] text-[#1A3A6B] text-center py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors"
                >
                  {t('consultation.bookNow')}
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-[#FDF6D0] rounded-2xl p-8 border border-[#F0C040]/30 opacity-60">
            <p className="text-[#1A3A6B] font-semibold text-center">
              More services coming soon...
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
