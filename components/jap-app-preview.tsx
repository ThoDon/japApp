import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { ExerciseGrid } from "./exercise-grid";
import { PdfGenerator } from "./pdf-generator";
import { JapAppState, JapAppAction } from "@/lib/types/jap-app-types";

interface JapAppPreviewProps {
  state: JapAppState;
  dispatch: React.Dispatch<JapAppAction>;
  d: Record<string, string>;
  onGenerate: () => void;
}

export function JapAppPreview({ state, d, onGenerate }: JapAppPreviewProps) {
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
        <Button onClick={onGenerate} className="w-full">
          {state.exercises.length > 0 ? (
            <RefreshCw className="mr-2 h-4 w-4" />
          ) : null}
          {state.exercises.length > 0 ? d.regenerate : d.generate}
        </Button>

        <div className="flex gap-2">
          <PdfGenerator
            exercises={state.exercises}
            showCorrection={state.showCorrection}
            categories={state.syllabarySubsets}
            dictionary={d}
          />
        </div>
      </div>
    </div>
  );
}
