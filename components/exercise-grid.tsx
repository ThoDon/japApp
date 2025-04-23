import { Exercise } from "../lib/types";

interface ExerciseGridProps {
  exercise: Exercise;
}

export function ExerciseGrid({ exercise }: ExerciseGridProps) {
  const exerciseDirection = exercise.direction;

  // For preview, we'll show a limited number of characters
  const previewGrid = exercise.grid.slice(0, 4);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-3">
        {previewGrid.map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-xl">
              {exerciseDirection === "syllabaryToRomaji"
                ? item.char
                : item.romaji}
            </div>
            <div className="mt-2 flex h-14 w-14 items-center justify-center rounded-md border text-base font-medium">
              {exerciseDirection === "syllabaryToRomaji"
                ? item.romaji
                : item.char}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
