
import { PLAYGROUND_SECTION_ID } from "@/lib/constants";
import { Link } from "@/i18n/routing";

interface CTAProps{
   title:string;
        description: string;
        button: {
            text: string;
            link: string;
        }
}

export function CTA(cta:CTAProps) {


  return (
    <section className="w-full py-16 lg:py-16">
      <div className="container mx-auto max-w-5xl px-4">
        {/* The Card-like container for the CTA content */}
        <div className="flex flex-col items-center rounded-2xl bg-gradient-to-br from-pink-200 via-purple-200 to-teal-200 p-8 text-center shadow-sm md:p-12">

          {/* Main Headline */}
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {cta.title}
          </h2>

          {/* Descriptive Text */}
          <p className="mt-4 max-w-2xl text-lg text-foreground">
            {cta.description}
          </p>

          {/* The Call to Action Button */}
          <div className="mt-8">
            <Link
              href={cta.button.link}
              className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-lg"
            >
              {cta.button.text}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

