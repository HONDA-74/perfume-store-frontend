import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/cn';

export function LanguageToggle({ className, showLabel = false }: { className?: string; showLabel?: boolean }) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language.startsWith('ar');
  const nextLanguage = isArabic ? 'en' : 'ar';
  const nextLabel = isArabic ? t('common.english') : t('common.arabic');

  return (
    <button
      type="button"
      onClick={() => void i18n.changeLanguage(nextLanguage)}
      className={cn('inline-flex h-9 items-center justify-center gap-2 border border-white/10 px-3 font-sans text-[10px] font-medium tracking-[0.12em] text-white/60 transition-colors hover:border-[#D4C3A3]/45 hover:text-[#D4C3A3]', className)}
      aria-label={`${t('common.language')}: ${nextLabel}`}
      title={`${t('common.language')}: ${nextLabel}`}
    >
      <Languages size={14} aria-hidden="true" />
      <span aria-hidden={!showLabel}>{showLabel ? nextLabel : nextLanguage.toUpperCase()}</span>
    </button>
  );
}
