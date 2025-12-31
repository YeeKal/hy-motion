import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getMessages } from "@/i18n/get-messages";
import { Locale } from "@/i18n/config";
import { Icon } from '@/components/wrapper/lucide-icon';
import Script from 'next/script'; // 引入 Script 组件用于加载 Tally

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const m = await getMessages(locale, "waitlist");

  return {
    title: m.waitlist.seo.title,
    description: m.waitlist.seo.description,
  };
}

export default async function WaitlistPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const m = await getMessages(locale, "waitlist");
  setRequestLocale(locale);

  // Tally Form URL
  // const TALLY_URL = "https://tally.so/embed/ODQz5g?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";
  const TALLY_URL = "https://tally.so/embed/xXMVk9?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";

  return (
    <section className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <div className="flex-grow container mx-auto px-6 py-16 sm:py-24 lg:px-8">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <p className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-full">
            {m.waitlist.badge}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-6">
            {m.waitlist.title}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-600 leading-relaxed">
            {m.waitlist.description}
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
      {/* --- Left Column: Tally Form Card (Swapped Position) --- */}
          
          {/* Left Column: Pro Features List */}
          <div className="space-y-10 lg:pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {m.waitlist.featuresTitle}
            </h2>
            
            {m.waitlist.features.map((feature: any, index: number) => (
              <div key={index} className="flex gap-x-5 group">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-white border border-gray-200 shadow-sm group-hover:border-indigo-300 group-hover:shadow-md transition-all duration-300">
                    <Icon name={feature.icon} className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Tally Form Card */}
          <div className="relative">
             {/* Decorative background blur */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20"></div>
            
            <div className="relative bg-white border border-gray-100 rounded-2xl shadow-xl p-6 sm:p-8">
              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-gray-900">
                    {m.waitlist.formTitle}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                    {m.waitlist.formSubtitle}
                </p>
              </div>

              {/* Tally Embed */}
              <div className="w-full">
                <iframe 
                    data-tally-src={TALLY_URL}
                    loading="lazy" 
                    width="100%" 
                    height="264" 
                    frameBorder="0" 
                    marginHeight={0} 
                    marginWidth={0} 
                    title="Waitlist Form"
                    className="w-full"
                >
                </iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-20">
          <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 font-medium group">
            <span className="group-hover:-translate-x-1 transition-transform"> &larr;</span> 
            <span className="ml-2">{m.waitlist.backLabel}</span>
          </Link>
        </div>
      </div>

      {/* Load Tally Script globally for this page */}
      <Script 
        src="https://tally.so/widgets/embed.js" 
        strategy="lazyOnload" 
      />
    </section>
  );
}