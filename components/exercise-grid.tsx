import { cn } from "@/lib/utils";

interface ExerciseGridProps {
  exercise: {
    type: string;
    grid: { char: string; romaji: string }[];
    direction?: "syllabaryToRomaji" | "romajiToSyllabary";
    pageFormat?: "halfPage" | "fullPage";
  };
  showCorrection: boolean;
  isPreview?: boolean;
  direction?: "syllabaryToRomaji" | "romajiToSyllabary";
  pageFormat?: "halfPage" | "fullPage";
}

export function ExerciseGrid({
  exercise,
  showCorrection,
  isPreview = false,
  direction = "syllabaryToRomaji",
}: ExerciseGridProps) {
  // Use the exercise properties if available, otherwise use the props
  const exerciseDirection = exercise.direction || direction;

  // For preview, we'll show a limited number of characters
  const previewGrid = isPreview ? exercise.grid.slice(0, 12) : exercise.grid;

  return (
    <div
      className={cn(
        "grid gap-4",
        isPreview ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
      )}
    >
      {/* Exercise Grid */}
      <div>
        <h3 className="mb-2 font-medium print:text-lg">
          {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {previewGrid.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-xl">
                {exerciseDirection === "syllabaryToRomaji"
                  ? item.char
                  : item.romaji}
              </div>
              <div className="relative mt-2 h-14 w-14 rounded-md border border-dashed">
                {/* Horizontal guide line */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300 opacity-50"></div>
                {/* Vertical guide line */}
                <div className="absolute top-0 left-1/2 w-px h-full bg-gray-300 opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Correction Grid */}
      {showCorrection && (
        <div className={cn(isPreview ? "mt-4" : "")}>
          <h3 className="mb-2 font-medium print:text-lg">Correction</h3>
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
      )}
    </div>
  );
}
