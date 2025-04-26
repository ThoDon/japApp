"use client";

import { useState } from "react";
import type { Exercise, SyllabarySubset } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Info, Loader, Printer } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type GeneratorButtonProps = {
  exercises: Exercise[];
  showCorrection: boolean;
  dictionary: Record<string, string>;
  categories: SyllabarySubset[];
};

export function GeneratorButton(props: GeneratorButtonProps) {
  const { exercises, showCorrection, dictionary, categories } = props;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      await generatePdf(exercises, showCorrection, categories, dictionary);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleGeneratePdf}
        variant="outline"
        disabled={exercises.length === 0}
        className="flex-1"
      >
        {isGenerating ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />{" "}
            {dictionary.patience}
          </>
        ) : (
          <>
            <Printer className="h-4 w-4" />
            {dictionary.print}
          </>
        )}
      </Button>
      {isGenerating && (
        <Alert className="py-2">
          <Info className="h-4 w-4" />
          <AlertTitle>{dictionary.patience}</AlertTitle>
          <AlertDescription>
            {dictionary.generatingExplanation}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

async function generatePdf(
  exercises: Exercise[],
  showCorrection: boolean,
  categories: SyllabarySubset[],
  dictionary: Record<string, string>
) {
  const response = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exercises, showCorrection, dictionary, categories }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  // Create temporary link and trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = "kana-sheet-exercises.pdf"; // Set filename
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
