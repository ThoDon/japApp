import { NextRequest } from "next/server";
import { PDFDocument } from "@/components/features/japanese/pdf/PdfDocument";
import { renderToBuffer } from "@react-pdf/renderer";
import type { Exercise, SyllabarySubset, CharSubset } from "@/lib/types";

interface GeneratePdfBody {
  exercises: Exercise[];
  showCorrection: boolean;
  dictionary: Record<string, string>;
  categories: SyllabarySubset[];
  charSubsets: CharSubset[];
}

export async function POST(req: NextRequest) {
  const {
    exercises,
    showCorrection,
    dictionary,
    categories,
    charSubsets,
  }: GeneratePdfBody = await req.json();

  const stream = await renderToBuffer(
    <PDFDocument
      exercises={exercises}
      showCorrection={showCorrection}
      dictionary={dictionary}
      categories={categories}
      charSubsets={charSubsets}
    />
  );

  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=kana-sheet-exercises.pdf",
    },
  });
}
