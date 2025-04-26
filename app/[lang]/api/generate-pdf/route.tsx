import { NextRequest } from "next/server";
import { PDFDocument } from "@/components/features/japanese/pdf/PdfDocument";
import { renderToBuffer } from "@react-pdf/renderer";
import { Exercise, SyllabarySubset } from "../../../../lib/types";

interface GeneratePdfBody {
  exercises: Exercise[];
  showCorrection: boolean;
  dictionary: Record<string, string>;
  categories: SyllabarySubset[];
}

export async function POST(req: NextRequest) {
  const { exercises, showCorrection, dictionary, categories }: GeneratePdfBody =
    await req.json();

  const stream = await renderToBuffer(
    <PDFDocument
      exercises={exercises}
      showCorrection={showCorrection}
      dictionary={dictionary}
      categories={categories}
    />
  );

  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=kana-sheet-exercises.pdf",
    },
  });
}
