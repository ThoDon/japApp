import { Suspense } from "react"
import { JapAppGenerator } from "@/components/jap-app-generator"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function MainPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-5xl">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold md:text-3xl">Jap&apos;App</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </header>

        <Suspense fallback={<div>Loading...</div>}>
          <JapAppGenerator />
        </Suspense>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Jap&apos;App - Application de génération d&apos;exercices de japonais
        </footer>
      </div>
    </main>
  )
}
