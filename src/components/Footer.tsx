import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();

  return (
    <footer className="bg-[#1A3A6B] text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div>
            <p className="text-xl font-bold mb-2">NAZANIN</p>
            <p className="text-[#F0C040] text-sm mb-4">AI Consultant | AI-konsult</p>
            <p className="text-blue-200 text-sm max-w-xs leading-relaxed">
              {t('tagline')}
            </p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="text-[#F0C040] font-semibold text-sm mb-3">Navigation</p>
              <div className="flex flex-col gap-2">
                <Link href={`/${locale}`} className="text-blue-200 hover:text-white text-sm transition-colors">Home</Link>
                <Link href={`/${locale}/about`} className="text-blue-200 hover:text-white text-sm transition-colors">About</Link>
                <Link href={`/${locale}/services`} className="text-blue-200 hover:text-white text-sm transition-colors">Services</Link>
                <Link href={`/${locale}/contact`} className="text-blue-200 hover:text-white text-sm transition-colors">Contact</Link>
              </div>
            </div>
            <div>
              <p className="text-[#F0C040] font-semibold text-sm mb-3">Location</p>
              <p className="text-blue-200 text-sm">Jönköping, Sweden</p>
            </div>
          </div>
        </div>
        <div className="border-t border-blue-800 pt-6 text-center">
          <p className="text-blue-300 text-sm">
            © {new Date().getFullYear()} Nazanin. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
