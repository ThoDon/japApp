export type SyllabaryType = "hiragana" | "katakana" | "kanji";
export type DirectionType = "syllabaryToRomaji" | "romajiToSyllabary";
export type PageFormatType = "halfPage" | "fullPage";

export interface Exercise {
  id: string;
  type: SyllabaryType;
  direction: DirectionType;
  pageFormat: PageFormatType;
  grid: { char: string; romaji: string }[];
  timestamp: number;
}
