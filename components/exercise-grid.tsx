import { cn } from "@/lib/utils"

interface ExerciseGridProps {
  exercise: {
    type: string
    size: string
    grid: { char: string; romaji: string }[]
    direction?: "syllabaryToRomaji" | "romajiToSyllabary"
  }
  showCorrection: boolean
  isPreview?: boolean
  direction?: "syllabaryToRomaji" | "romajiToSyllabary"
}

export function ExerciseGrid({
  exercise,
  showCorrection,
  isPreview = false,
  direction = "syllabaryToRomaji",
}: ExerciseGridProps) {
  // Use the exercise direction if available, otherwise use the prop
  const exerciseDirection = exercise.direction || direction

  const sizeClasses = {
    small: "text-lg md:text-xl",
    normal: "text-xl md:text-2xl",
    large: "text-2xl md:text-3xl",
  }

  const gridClasses = {
    small: "grid-cols-5",
    normal: "grid-cols-4",
    large: "grid-cols-3",
  }

  const characterSizeClasses = {
    small: "h-14 w-14",
    normal: "h-16 w-16",
    large: "h-20 w-20",
  }

  const writingBoxClasses = {
    small: "h-14 w-14",
    normal: "h-16 w-16",
    large: "h-20 w-20",
  }

  return (
    <div className={cn("grid gap-4", isPreview ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
      {/* Exercise Grid */}
      <div>
        <h3 className="mb-2 font-medium print:text-lg">
          {exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
        </h3>
        <div className={cn("grid gap-4", gridClasses[exercise.size as keyof typeof gridClasses])}>
          {exercise.grid.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center rounded-md border border-primary/20 bg-primary/5",
                  sizeClasses[exercise.size as keyof typeof sizeClasses],
                  characterSizeClasses[exercise.size as keyof typeof characterSizeClasses],
                )}
              >
                {exerciseDirection === "syllabaryToRomaji" ? item.char : item.romaji}
              </div>
              <div
                className={cn(
                  "mt-2 relative border border-dashed rounded-md",
                  writingBoxClasses[exercise.size as keyof typeof writingBoxClasses],
                )}
              >
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
          <div className={cn("grid gap-4", gridClasses[exercise.size as keyof typeof gridClasses])}>
            {exercise.grid.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-md border border-primary/20 bg-primary/5",
                    sizeClasses[exercise.size as keyof typeof sizeClasses],
                    characterSizeClasses[exercise.size as keyof typeof characterSizeClasses],
                  )}
                >
                  {exerciseDirection === "syllabaryToRomaji" ? item.char : item.romaji}
                </div>
                <div
                  className={cn(
                    "mt-2 flex items-center justify-center rounded-md border",
                    writingBoxClasses[exercise.size as keyof typeof writingBoxClasses],
                  )}
                >
                  {exerciseDirection === "syllabaryToRomaji" ? item.romaji : item.char}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
