"use client";

import { useCallback, useEffect, useReducer } from "react";
import { generateExercise } from "@/lib/japanese-utils";
import { GeneratorControls } from "./generator-controls";
import { GeneratorPreview } from "./generator-preview";
import { Locale } from "@/i18n/i18nConfig";
import {
  Exercise,
  DirectionType,
  PageFormatType,
  SyllabaryType,
  SyllabarySubset,
  CharSubset,
} from "@/lib/types";
import {
  generatorReducer,
  initialState,
} from "@/lib/reducers/generator-reducer";
import { Card, CardContent } from "@/components/ui/card";
import { History } from "../history/history";

export function Generator({
  d,
  locale,
}: {
  d: Record<string, string>;
  locale: Locale;
}) {
  const [state, dispatch] = useReducer(generatorReducer, initialState);

  const generateAndSet = useCallback(
    ({
      pageFormat,
      pageCount,
      syllabaryType,
      direction,
      syllabarySubsets,
      charSubsets,
    }: {
      pageFormat: PageFormatType;
      pageCount: number;
      syllabaryType: SyllabaryType;
      direction: DirectionType;
      syllabarySubsets: SyllabarySubset[];
      charSubsets: CharSubset[];
    }) => {
      const newExercises = generateExercises(
        pageFormat,
        pageCount,
        syllabaryType,
        direction,
        syllabarySubsets,
        charSubsets
      );

      dispatch({ type: "SET_EXERCISES", payload: newExercises });
      dispatch({ type: "ADD_TO_HISTORY", payload: newExercises });
    },
    []
  );

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
      generateAndSet({
        pageFormat: state.pageFormat,
        pageCount: state.pageCount,
        syllabaryType: state.syllabaryType,
        direction: state.direction,
        syllabarySubsets: state.syllabarySubsets,
        charSubsets: state.charSubsets,
      });
    }
  }, [
    generateAndSet,
    state.charSubsets,
    state.direction,
    state.exercises.length,
    state.pageCount,
    state.pageFormat,
    state.syllabarySubsets,
    state.syllabaryType,
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
          <GeneratorControls state={state} dispatch={dispatch} d={d} />
          <GeneratorPreview
            state={state}
            dispatch={dispatch}
            d={d}
            onGenerate={generateAndSet}
          />
        </CardContent>
      </Card>
      <History
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
  syllabarySubsets: SyllabarySubset[],
  charSubsets: CharSubset[]
): Exercise[] {
  const charactersPerPage = getCharactersPerPage(pageFormat);

  return Array.from({ length: pageCount }, (_, i) => {
    const grid = generateExercise(
      syllabaryType,
      syllabarySubsets,
      charSubsets,
      charactersPerPage
    );
    while (grid.length < charactersPerPage) {
      const moreChars = generateExercise(
        syllabaryType,
        syllabarySubsets,
        charSubsets,
        charactersPerPage - grid.length
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
