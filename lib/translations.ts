export const fr = {
  syllabaryType: "Type de syllabaire",
  hiragana: "Hiragana",
  katakana: "Katakana",
  kanji: "Kanji",
  comingSoon: "Bientôt disponible...",
  numberOfPages: "Nombre de pages",
  pageFormat: "Format de page",
  halfPage: "Demi-page",
  fullPage: "Page entière",
  showCorrection: "Afficher la correction",
  preview: "Aperçu",
  generateToPreview: "Générez pour voir l'aperçu",
  generate: "Générer les exercices",
  regenerate: "Générer de nouveaux exercices",
  print: "Imprimer",
  debug: "Déboguer",
  history: "Historique",
  clearHistory: "Tout effacer",
  noHistory: "Pas d'historique pour le moment. Générez des exercices pour les voir ici.",
  load: "Charger",
  direction: "Direction de l'exercice",
  syllabaryToRomaji: "Syllabaire → Romaji",
  romajiToSyllabary: "Romaji → Syllabaire",
  characterCount: "Nombre de caractères",
  selectCharacterCount: "Sélectionner le nombre",
}

// English
export const en = {
  syllabaryType: "Syllabary Type",
  hiragana: "Hiragana",
  katakana: "Katakana",
  kanji: "Kanji",
  comingSoon: "Coming soon...",
  numberOfPages: "Number of Pages",
  pageFormat: "Page Format",
  halfPage: "Half Page",
  fullPage: "Full Page",
  showCorrection: "Show correction",
  preview: "Preview",
  generateToPreview: "Generate to see preview",
  generate: "Generate Exercises",
  regenerate: "Generate New Exercises",
  print: "Print",
  debug: "Debug",
  history: "History",
  clearHistory: "Clear All",
  noHistory: "No history yet. Generate exercises to see them here.",
  load: "Load",
  direction: "Exercise Direction",
  syllabaryToRomaji: "Syllabary → Romaji",
  romajiToSyllabary: "Romaji → Syllabary",
  characterCount: "Character Count",
  selectCharacterCount: "Select character count",
}

// Translations object
export const translations = {
  fr,
  en,
}

// Default language
export const defaultLocale = "fr"

// Get browser language
export const getBrowserLanguage = (): string => {
  if (typeof window === "undefined") return defaultLocale

  const browserLang = navigator.language.split("-")[0]
  return translations[browserLang as keyof typeof translations] ? browserLang : defaultLocale
}
