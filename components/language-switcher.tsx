"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { useTranslations } from "@/hooks/use-translations"

export function LanguageSwitcher() {
  const { locale, changeLocale } = useTranslations()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change language">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLocale("fr")} className={locale === "fr" ? "bg-muted" : ""}>
          Français
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLocale("en")} className={locale === "en" ? "bg-muted" : ""}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
