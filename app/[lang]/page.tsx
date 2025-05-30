import { Suspense } from "react";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/i18nConfig";
import { Generator } from "@/components/features/japanese/generator/generator";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        <>
          <header className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold md:text-3xl">
              <span className="jap-highlight">Kana&apos;</span>Sheet
            </h1>
            <div className="flex items-center gap-2">
              <LanguageSwitcher locale={lang} />
              <ThemeSwitcher />
            </div>
          </header>

          <Suspense fallback={<div>Loading...</div>}>
            <Generator d={dictionary} locale={lang} />
          </Suspense>

          <footer className="mt-12 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Kana&apos;Sheet -{" "}
            {dictionary.footer}
          </footer>
        </>
      </div>
    </main>
  );
}
