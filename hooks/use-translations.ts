"use client"

import { useState, useEffect } from "react"
import { translations, defaultLocale, getBrowserLanguage } from "@/lib/translations"

// Global state for the current locale
let currentLocale = defaultLocale

export function useTranslations() {
  const [locale, setLocale] = useState(currentLocale)

  useEffect(() => {
    // Set locale from browser on client side
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("japapp-locale") || getBrowserLanguage()
      setLocale(savedLocale)
      currentLocale = savedLocale
    }
  }, [])

  const t = (key: string): string => {
    const localeTranslations = translations[locale as keyof typeof translations] || translations[defaultLocale]
    return localeTranslations[key as keyof typeof localeTranslations] || key
  }

  const changeLocale = (newLocale: string) => {
    if (translations[newLocale as keyof typeof translations]) {
      setLocale(newLocale)
      currentLocale = newLocale
      if (typeof window !== "undefined") {
        localStorage.setItem("japapp-locale", newLocale)
      }
    }
  }

  return { t, locale, changeLocale }
}
