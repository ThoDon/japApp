import { cn } from "@/lib/utils";
import { Exercise } from "../lib/types";

interface ExerciseGridProps {
  exercise: Exercise;
}

export function ExerciseGrid({ exercise }: ExerciseGridProps) {
  // Use the exercise properties if available, otherwise use the props
  const exerciseDirection = exercise.direction;

  // For preview, we'll show a limited number of characters
  const previewGrid = exercise.grid.slice(0, 4);

  return (
    <div className={cn("grid gap-4", "grid-cols-1")}>
      {/* Exercise Grid */}
      <div>
        <h3 className="mb-2 font-medium print:text-lg">
          <span>
            {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
          </span>
        </h3>
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
      </div>
    </div>
  );
}
