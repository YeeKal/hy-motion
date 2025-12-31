import { useTranslations } from 'next-intl';

export default function DiveDeeper() {
  const t = useTranslations('home.diveDeeper');
  const items = ['paper', 'code'] as const;

  return (
    <section className="w-full bg-primary text-primary-foreground py-20 sm:py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold">{t('title')}</h2>
        <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">{t('description')}</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {items.map((key) => (
            <a
              key={key}
              href={t(`items.${key}.link`)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 bg-primary-foreground rounded-lg hover:bg-muted hover:shadow-lg transition-colors block"
            >
              <span className="text-4xl">{t(`items.${key}.icon`)}</span>
              <h3 className="mt-4 text-xl font-bold text-foreground">{t(`items.${key}.title`)}</h3>
              <p className="mt-2 text-foreground">{t(`items.${key}.description`)}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}