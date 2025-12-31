import { getMessages } from "@/i18n/get-messages";
import { Locale } from "@/i18n/config";
import { getPostContent } from "@/lib/posts";
import { formatDate } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"


export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const m = await getMessages(locale, "about");

    return {
        title: m.about.seo.title,
        description: m.about.seo.description,
    };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const { meta, content } = await getPostContent(`content/pages/about.${locale}`);
    const m = await getMessages(locale, "about");

    const formattedDate = meta.date instanceof Date ? formatDate(meta.date) : meta.date


    return (
        <div className="container max-w-5xl mx-auto px-4 py-8">
            {/* Blog header */}
            <section className="mb-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight mb-4">{meta.title}</h1>
                </div>

                <div className="flex items-center text-muted-foreground gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    <time dateTime={formattedDate}>{formattedDate}</time>
                    <span className="text-xs">{m.lastUpdatedLabel}</span>
                </div>
            </section >

            <article className="flex-1 prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }}></article>
        </div>
    )

}

