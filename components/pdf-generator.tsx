"use client";

import { useState } from "react";
import type { Exercise, SyllabarySubset } from "../lib/types";
import { Button } from "./ui/button";
import { Loader, Printer } from "lucide-react";

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

  // Download the PDF file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "kana-sheet-exercises.pdf";
  link.click();
}

type PdfGeneratorProps = {
  exercises: Exercise[];
  showCorrection: boolean;
  dictionary: Record<string, string>;
  categories: SyllabarySubset[];
};

export function PdfGenerator(props: PdfGeneratorProps) {
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
    <Button
      onClick={handleGeneratePdf}
      variant="outline"
      disabled={exercises.length === 0}
      className="flex-1"
    >
      {isGenerating ? (
        <Loader className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <>
          <Printer className="mr-2 h-4 w-4" />
          {dictionary.print}
        </>
      )}
    </Button>
  );
}
