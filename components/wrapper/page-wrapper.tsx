import Footer from "@/components/wrapper/footer";
import { Header } from "@/components/wrapper/header";
import { getLocale } from "next-intl/server";
import { getAllToolConfigs } from "@/lib/config/tool-utils";

export default async function PageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
    const toolMetaConfigs = await getAllToolConfigs(locale);

  return (
    <>
      <Header toolMetaConfigs={toolMetaConfigs} />
      <main className="min-h-screen pt-[0rem]">
        <div className=" absolute z-[-99] pointer-events-none inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        {children}
      </main>
      <Footer />
    </>
  );
}
