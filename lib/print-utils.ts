"use client";

import { DirectionType, Exercise } from "@/lib/types";

export async function printDocument(
  exercises: Exercise[],
  showCorrection: boolean,
  d: Record<string, string> = {}
) {
  if (typeof window === "undefined") return;

  //@ts-expect-error html2pdf.js has no types
  const html2pdf = (await import("html2pdf.js")).default;

  const container = document.createElement("div");
  container.innerHTML = generateHtmlContent(exercises, showCorrection, d);

  const opt = {
    margin: 0.2,
    filename: `japapp-exercises.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["avoid-all", "css", "legacy"] },
  };

  await html2pdf().set(opt).from(container).save();
}

export function debugPrintDocument(
  exercises: Exercise[],
  showCorrection: boolean,
  d: Record<string, string> = {}
) {
  const html = generateHtmlContent(exercises, showCorrection, d);
  const debugWindow = window.open("", "_blank");
  debugWindow?.document.write(html);
  debugWindow?.document.close();
}

function generateHtmlContent(
  exercises: Exercise[],
  showCorrection: boolean,
  d: Record<string, string>
): string {
  const columns = 16;
  const style = getPrintStyles(columns, exercises[0].direction);

  let html = `${style}<div class="print-container">`;

  exercises.forEach((exercise, index) => {
    const { type, direction, pageFormat, grid } = exercise;
    const directionLabel =
      direction === "syllabaryToRomaji"
        ? `${d[type]} → ${d.romaji}`
        : `${d.romaji} → ${d[type]}`;

    const pageLabel = exercises.length > 1 ? ` ${index + 1}` : "";

    if (index > 0) html += `<div class="page-break"></div>`;

    html += renderHeader(`${d.exercise}${pageLabel} -  ${directionLabel}`);
    html += `<div class="exercise-section no-break"><div class="exercise-grid">`;
    html += renderGrid(grid, direction, false);
    html += `</div>`;

    if (showCorrection) {
      if (pageFormat === "fullPage") {
        html += `<div class="page-break"></div>`;
        html += renderHeader(
          `${d.correction}${pageLabel} -  ${directionLabel}`
        );
      }

      html += `<div class="correction-grid no-break"><div class="exercise-grid">`;
      html += renderGrid(grid, direction, true);
      html += `</div></div>`;
    }

    html += `</div>`;
  });

  html += `</div>`;
  return html;
}

function renderHeader(label: string): string {
  return `
    <div class="page-header">
      <span class="logo"><span style="color: #e7000b; font-weight: bold;">Jap'</span>App</span>&nbsp;-&nbsp<span>${label}</span>
    </div>
  `;
}

function renderGrid(
  grid: { char: string; romaji: string }[],
  direction: DirectionType,
  isCorrection: boolean
): string {
  let output = "";
  for (let i = 0; i < grid.length; i++) {
    const item = i < grid.length ? grid[i] : grid[grid.length - 1];
    const main = direction === "syllabaryToRomaji" ? item.char : item.romaji;
    const correction =
      direction === "syllabaryToRomaji" ? item.romaji : item.char;

    output += `
      <div class="character-cell">
        <div class="character">${main}</div>
        <div class="writing-box ${!isCorrection && "writing-box--exercise"}">
          ${
            isCorrection
              ? `<div class="correction-text">${correction}</div>`
              : ""
          }
        </div>
      </div>
    `;
  }
  return output;
}

function getPrintStyles(columns: number, direction: DirectionType): string {
  const styles = getPrintStylesObject(columns, direction);
  const fontImport = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
  `;
  return `<style>${fontImport}\n${cssObjectToString(styles)}</style>`;
}

type CSSProperties = Partial<Record<keyof CSSStyleDeclaration, string>>;

type CSSStyleSheetObject = {
  [selector: string]: CSSProperties;
};

function getPrintStylesObject(
  columns: number,
  direction: DirectionType
): CSSStyleSheetObject {
  return {
    body: {
      fontFamily: "'Noto Sans JP', Inter, 'Arial', sans-serif",
      padding: "0",
      margin: "0",
      color: "#333",
    },
    ".print-container": {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    ".page-header": {
      display: "flex",
      alignItems: "center",

      borderBottom: "1px solid #ddd",
      fontSize: "12px",
      color: "#666",
    },
    ".exercise-section": {
      breakInside: "avoid",
    },
    ".exercise-grid": {
      display: "grid",
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: "10px",
    },
    ".character-cell": {
      display: "grid",
      placeContent: "center",
      gap: "3px",
    },
    ".correction-text": {
      fontWeight: "500",
      fontSize: "16px",
      ...(direction === "romajiToSyllabary" && { fontSize: "20px" }),
    },
    ".character": {
      fontSize: "16px",
      ...(direction === "syllabaryToRomaji" && { fontSize: "20px" }),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "35px",
      height: "35px",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "rgba(0, 0, 0, 0.03)",
    },
    ".writing-box": {
      position: "relative",
      marginTop: "2px",
      width: "35px",
      height: "35px",
      border: "1px dashed #ddd",
      borderRadius: "4px",
      display: "grid",
      placeContent: "center",
    },
    ".writing-box--exercise::before": {
      content: '""',
      position: "absolute",
      backgroundColor: "#ddd",
      opacity: "0.5",
      width: "100%",
      height: "1px",
      top: "50%",
      left: "0",
    },
    ".writing-box--exercise::after": {
      content: '""',
      position: "absolute",
      backgroundColor: "#ddd",
      opacity: "0.5",
      width: "1px",
      height: "100%",
      top: "0",
      left: "50%",
    },
    ".correction-grid": {
      marginTop: "10px",
      paddingTop: "10px",
    },

    ".page-break": {
      pageBreakBefore: "always",
      breakBefore: "page",
    },
    ".no-break": {
      pageBreakInside: "avoid",
      breakInside: "avoid",
    },
  };
}

function cssObjectToString(styles: CSSStyleSheetObject): string {
  return Object.entries(styles)
    .map(([selector, declarations]) => {
      const rules = Object.entries(declarations)
        .map(([prop, value]) => {
          const kebabProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
          return `${kebabProp}: ${value};`;
        })
        .join(" ");
      return `${selector} { ${rules} }`;
    })
    .join("\n");
}
