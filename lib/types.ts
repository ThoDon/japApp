export type SyllabaryType = "hiragana" | "katakana" | "kanji";
export type DirectionType = "syllabaryToRomaji" | "romajiToSyllabary";
export type PageFormatType = "halfPage" | "fullPage";

export type SyllabarySubset = "gojuon" | "dakuten" | "handakuten" | "yoon";
export type CharSubset = "a_ko" | "sa_to" | "na_ho" | "ma_yo" | "ra_n";

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

export interface GeneratorState {
  syllabaryType: SyllabaryType;
  pageCount: number;
  showCorrection: boolean;
  exercises: Exercise[];
  history: Exercise[];
  direction: DirectionType;
  pageFormat: PageFormatType;
  syllabarySubsets: SyllabarySubset[];
  charSubsets: CharSubset[];
}

export type GeneratorAction =
  | { type: "SET_SYLLABARY_TYPE"; payload: SyllabaryType }
  | { type: "SET_PAGE_COUNT"; payload: number }
  | { type: "SET_SHOW_CORRECTION"; payload: boolean }
  | { type: "SET_EXERCISES"; payload: Exercise[] }
  | { type: "SET_HISTORY"; payload: Exercise[] }
  | { type: "SET_DIRECTION"; payload: DirectionType }
  | { type: "SET_PAGE_FORMAT"; payload: PageFormatType }
  | { type: "SET_SYLLABARY_SUBSETS"; payload: SyllabarySubset[] }
  | { type: "SET_CHAR_SUBSETS"; payload: CharSubset[] }
  | { type: "ADD_TO_HISTORY"; payload: Exercise[] }
  | { type: "REMOVE_FROM_HISTORY"; payload: string }
  | { type: "CLEAR_HISTORY" };
