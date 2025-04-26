import {
  SyllabaryType,
  Exercise,
  DirectionType,
  PageFormatType,
  SyllabarySubset,
} from "../types";

export interface JapAppState {
  syllabaryType: SyllabaryType;
  pageCount: number | undefined;
  showCorrection: boolean;
  exercises: Exercise[];
  history: Exercise[];
  direction: DirectionType;
  pageFormat: PageFormatType;
  syllabarySubsets: SyllabarySubset[];
}

export type JapAppAction =
  | { type: "SET_SYLLABARY_TYPE"; payload: SyllabaryType }
  | { type: "SET_PAGE_COUNT"; payload: number | undefined }
  | { type: "SET_SHOW_CORRECTION"; payload: boolean }
  | { type: "SET_EXERCISES"; payload: Exercise[] }
  | { type: "SET_HISTORY"; payload: Exercise[] }
  | { type: "SET_DIRECTION"; payload: DirectionType }
  | { type: "SET_PAGE_FORMAT"; payload: PageFormatType }
  | { type: "SET_SYLLABARY_SUBSETS"; payload: SyllabarySubset[] }
  | { type: "ADD_TO_HISTORY"; payload: Exercise[] }
  | { type: "REMOVE_FROM_HISTORY"; payload: string }
  | { type: "CLEAR_HISTORY" };
