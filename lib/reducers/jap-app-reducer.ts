import { JapAppState, JapAppAction } from "../types/jap-app-types";

export const initialState: JapAppState = {
  syllabaryType: "hiragana",
  pageCount: 1,
  showCorrection: true,
  exercises: [],
  history: [],
  direction: "syllabaryToRomaji",
  pageFormat: "halfPage",
  syllabarySubsets: ["gojuon", "dakuten", "handakuten", "yoon"],
};

export function japAppReducer(
  state: JapAppState,
  action: JapAppAction
): JapAppState {
  switch (action.type) {
    case "SET_SYLLABARY_TYPE":
      return { ...state, syllabaryType: action.payload };
    case "SET_PAGE_COUNT":
      return { ...state, pageCount: action.payload };
    case "SET_SHOW_CORRECTION":
      return { ...state, showCorrection: action.payload };
    case "SET_EXERCISES":
      return { ...state, exercises: action.payload };
    case "SET_HISTORY":
      return { ...state, history: action.payload };
    case "SET_DIRECTION":
      return { ...state, direction: action.payload };
    case "SET_PAGE_FORMAT":
      return { ...state, pageFormat: action.payload };
    case "SET_SYLLABARY_SUBSETS":
      return { ...state, syllabarySubsets: action.payload };
    case "ADD_TO_HISTORY":
      return {
        ...state,
        history: [...action.payload, ...state.history].slice(0, 10),
      };
    case "REMOVE_FROM_HISTORY":
      return {
        ...state,
        history: state.history.filter((item) => item.id !== action.payload),
      };
    case "CLEAR_HISTORY":
      return { ...state, history: [] };
    default:
      return state;
  }
}
