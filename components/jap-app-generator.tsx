"use client";

import { useCallback, useEffect, useReducer } from "react";
import { generateGrid } from "@/lib/japanese-utils";
import { JapAppControls } from "./jap-app-controls";
import { JapAppPreview } from "./jap-app-preview";
import { JapAppHistory } from "./jap-app-history";
import { Locale } from "@/i18n/i18nConfig";
import {
  Exercise,
  DirectionType,
  PageFormatType,
  SyllabaryType,
  SyllabarySubset,
} from "@/lib/types";
import { japAppReducer, initialState } from "@/lib/reducers/jap-app-reducer";
import { Card, CardContent } from "./ui/card";

export function JapAppGenerator({
  d,
  locale,
}: {
  d: Record<string, string>;
  locale: Locale;
}) {
  const [state, dispatch] = useReducer(japAppReducer, initialState);

  const generateAndSet = useCallback(() => {
    if (!state.pageCount) return;
    const newExercises = generateExercises(
      state.pageFormat,
      state.pageCount,
      state.syllabaryType,
      state.direction,
      state.syllabarySubsets
    );

    dispatch({ type: "SET_EXERCISES", payload: newExercises });
    dispatch({ type: "ADD_TO_HISTORY", payload: newExercises });
  }, [
    state.pageCount,
    state.pageFormat,
    state.syllabaryType,
    state.direction,
    state.syllabarySubsets,
  ]);

  // Load history from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("kana-history");
      if (savedHistory) {
        try {
          dispatch({ type: "SET_HISTORY", payload: JSON.parse(savedHistory) });
        } catch (e) {
          console.error("Failed to parse history:", e);
        }
      }
    }
  }, []);

  // Save history to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("kana-sheet-history", JSON.stringify(state.history));
    }
  }, [state.history]);

  // Generate new exercises when parameters change
  useEffect(() => {
    if (state.exercises.length > 0) {
      generateAndSet();
    }
  }, [
    state.syllabaryType,
    state.direction,
    state.pageFormat,
    generateAndSet,
    state.exercises.length,
  ]);

  const loadFromHistory = (exercise: Exercise) => {
    dispatch({ type: "SET_EXERCISES", payload: [exercise] });
    dispatch({ type: "SET_SYLLABARY_TYPE", payload: exercise.type });
    dispatch({ type: "SET_DIRECTION", payload: exercise.direction });
    dispatch({ type: "SET_PAGE_FORMAT", payload: exercise.pageFormat });
    dispatch({ type: "SET_PAGE_COUNT", payload: 1 });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <JapAppControls state={state} dispatch={dispatch} d={d} />
          <JapAppPreview
            state={state}
            dispatch={dispatch}
            d={d}
            onGenerate={generateAndSet}
          />
        </CardContent>
      </Card>
      <JapAppHistory
        state={state}
        dispatch={dispatch}
        d={d}
        locale={locale}
        onLoadFromHistory={loadFromHistory}
      />
    </div>
  );
}

function generateExercises(
  pageFormat: PageFormatType,
  pageCount: number,
  syllabaryType: SyllabaryType,
  direction: DirectionType,
  syllabarySubsets: SyllabarySubset[]
): Exercise[] {
  const charactersPerPage = getCharactersPerPage(pageFormat);

  return Array.from({ length: pageCount }, (_, i) => {
    const grid = generateGrid(
      syllabaryType,
      charactersPerPage,
      syllabarySubsets
    );
    while (grid.length < charactersPerPage) {
      const moreChars = generateGrid(
        syllabaryType,
        charactersPerPage - grid.length,
        syllabarySubsets
      );
      grid.push(...moreChars);
    }

    return {
      id: `${Date.now()}-${i}`,
      type: syllabaryType,
      direction,
      pageFormat,
      grid,
      timestamp: Date.now(),
    };
  });
}

const getCharactersPerPage = (pageFormat: PageFormatType): number => {
  return pageFormat === "halfPage" ? 84 : 132;
};
