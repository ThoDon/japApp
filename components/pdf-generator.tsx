"use client";

import { useState } from "react";
import { Exercise } from "../lib/types";
import { Button } from "./ui/button";
import { Loader, Printer } from "lucide-react";

async function generatePdf(
  exercises: Exercise[],
  showCorrection: boolean,
  dictionary: Record<string, string>
) {
  const response = await fetch("/api/generate-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exercises, showCorrection, dictionary }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate PDF");
  }

  const blob = await response.blob();

  // Download the PDF file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "japapp-exercises.pdf";
  link.click();
}

type PdfGeneratorProps = {
  exercises: Exercise[];
  showCorrection: boolean;
  dictionary: Record<string, string>;
};

export function PdfGenerator(props: PdfGeneratorProps) {
  const { exercises, showCorrection, dictionary } = props;
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      await generatePdf(exercises, showCorrection, dictionary);
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
