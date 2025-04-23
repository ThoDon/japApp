import { NextRequest } from "next/server";
import { PDFDocument } from "@/pdf/PdfDocument";
import { renderToBuffer } from "@react-pdf/renderer";
import { Exercise } from "../../../../lib/types";

interface GeneratePdfBody {
  exercises: Exercise[];
  showCorrection: boolean;
  dictionary: Record<string, string>;
}

export async function POST(req: NextRequest) {
  const { exercises, showCorrection, dictionary }: GeneratePdfBody =
    await req.json();

  const stream = await renderToBuffer(
    <PDFDocument
      exercises={exercises}
      showCorrection={showCorrection}
      dictionary={dictionary}
    />
  );

  return new Response(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=japapp-exercises.pdf",
    },
  });
}
