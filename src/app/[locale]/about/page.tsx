import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <section className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-12">
          <p className="text-[#F0C040] text-sm font-semibold tracking-widest uppercase mb-3">
            About / Om mig / درباره من
          </p>
          <h1 className="text-4xl font-bold text-[#1A3A6B] mb-4">{t('title')}</h1>
          <p className="text-[#3A6ABB] text-lg">{t('subtitle')}</p>
        </div>

        <div className="bg-[#E8F0FF] rounded-2xl p-10 border border-[#E0E0E0]">
          <div className="w-32 h-32 bg-[#1A3A6B] rounded-full mx-auto mb-8 flex items-center justify-center">
            <span className="text-[#F0C040] text-4xl font-bold">N</span>
          </div>
          <p className="text-center text-gray-500 italic">{t('description')}</p>
        </div>
      </div>
    </section>
  );
}
