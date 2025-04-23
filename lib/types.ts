export type SyllabaryType = "hiragana" | "katakana" | "kanji";
export type DirectionType = "syllabaryToRomaji" | "romajiToSyllabary";
export type PageFormatType = "halfPage" | "fullPage";

export type SyllabarySubset = "gojuon" | "dakuten" | "handakuten" | "yoon";

export type SyllabaryRecord = {
  [key in SyllabarySubset]: { char: string; romaji: string }[];
};

export interface Exercise {
  id: string;
  type: SyllabaryType;
  direction: DirectionType;
  pageFormat: PageFormatType;
  grid: { char: string; romaji: string }[];
  timestamp: number;
}
