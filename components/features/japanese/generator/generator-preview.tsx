import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ExerciseGrid } from "../shared/exercise-grid";
import { GeneratorButton } from "./generator-button";
import {
  GeneratorState,
  GeneratorAction,
  CharSubset,
  DirectionType,
  PageFormatType,
  SyllabarySubset,
  SyllabaryType,
} from "@/lib/types";

interface GeneratorPreviewProps {
  state: GeneratorState;
  dispatch: React.Dispatch<GeneratorAction>;
  d: Record<string, string>;
  onGenerate: (data: {
    pageFormat: PageFormatType;
    pageCount: number;
    syllabaryType: SyllabaryType;
    direction: DirectionType;
    syllabarySubsets: SyllabarySubset[];
    charSubsets: CharSubset[];
  }) => void;
}

export function GeneratorPreview({
  state,
  d,
  onGenerate,
}: GeneratorPreviewProps) {
  const handleGenerate = () => {
    const {
      pageFormat,
      pageCount,
      syllabaryType,
      direction,
      syllabarySubsets,
      charSubsets,
    } = state;
    onGenerate({
      pageFormat,
      pageCount,
      syllabaryType,
      direction,
      syllabarySubsets,
      charSubsets,
    });
  };
  return (
    <div className="flex flex-col justify-between gap-4">
      <div className="rounded-lg border p-4 h-full">
        <h3 className="mb-2 font-medium">{d.preview}</h3>
        {state.exercises.length > 0 ? (
          <div className="max-h-60 overflow-auto">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium capitalize">
                {state.exercises[0].type}
              </h3>
              <span className="text-sm text-muted-foreground">
                {d[state.exercises[0].pageFormat]}
              </span>
            </div>
            <ExerciseGrid exercise={state.exercises[0]} />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            {d.generateToPreview}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={handleGenerate} className="w-full">
          {state.exercises.length > 0 ? (
            <RefreshCw className="mr-2 h-4 w-4" />
          ) : null}
          {state.exercises.length > 0 ? d.regenerate : d.generate}
        </Button>

        <div className="flex flex-col gap-2">
          <GeneratorButton
            exercises={state.exercises}
            showCorrection={state.showCorrection}
            categories={state.syllabarySubsets}
            charSubsets={state.charSubsets}
            dictionary={d}
          />
        </div>
      </div>
    </div>
  );
}
