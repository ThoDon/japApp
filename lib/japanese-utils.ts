import { SyllabaryType, SyllabarySubset, CharSubset } from "./types";
import { getAllKanaEntries } from "./kana-data";

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function generateExercise(
  type: SyllabaryType,
  syllabarySubsets: SyllabarySubset[],
  charSubsets: CharSubset[],
  count: number
) {
  const characterSet = getAllKanaEntries(type, syllabarySubsets, charSubsets);

  // For large counts, we need to repeat characters
  const repeats = Math.ceil(count / characterSet.length);
  let allChars: { char: string; romaji: string }[] = [];

  for (let i = 0; i < repeats; i++) {
    allChars = [...allChars, ...shuffleArray(characterSet)];
  }

  // Take exactly the number of characters needed
  return allChars.slice(0, count);
}

export function generateExercises(
  type: SyllabaryType,
  syllabarySubsets: SyllabarySubset[],
  charSubsets: CharSubset[],
  count: number,
  pageCount: number
) {
  const exercises = [];
  const charactersPerPage = Math.ceil(count / pageCount);

  for (let i = 0; i < pageCount; i++) {
    const exercise = generateExercise(
      type,
      syllabarySubsets,
      charSubsets,
      charactersPerPage
    );
    exercises.push(exercise);
  }

  return exercises;
}

export const syllabarySubsetsRecord: Record<SyllabarySubset, string> = {
  gojuon: "Gojūon",
  dakuten: "Dakuten",
  handakuten: "Handakuten",
  yoon: "Yōon",
};

export const charSubsetsRecord: Record<CharSubset, string> = {
  a_ko: "a - ko",
  sa_to: "sa - to",
  na_ho: "na - ho",
  ma_yo: "ma - yo",
  ra_n: "ra - n",
};
