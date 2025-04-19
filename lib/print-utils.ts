"use client"

interface Exercise {
  id: string
  type: string
  direction?: "syllabaryToRomaji" | "romajiToSyllabary"
  pageFormat?: "halfPage" | "fullPage"
  grid: { char: string; romaji: string }[]
}

// Function to create a print-friendly version of the exercises
export function printDocument(
  exercises: Exercise[],
  showCorrection: boolean,
  direction: "syllabaryToRomaji" | "romajiToSyllabary" = "syllabaryToRomaji",
  pageFormat: "halfPage" | "fullPage" = "halfPage",
  debug = false,
) {
  // Create a hidden iframe for printing instead of opening a new window
  const iframe = document.createElement("iframe")
  iframe.style.position = "fixed"
  iframe.style.right = "0"
  iframe.style.bottom = "0"
  iframe.style.width = "0"
  iframe.style.height = "0"
  iframe.style.border = "0"

  document.body.appendChild(iframe)

  // Get the iframe document
  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document

  if (!iframeDoc) {
    alert("Unable to create print document")
    return
  }

  // Fixed number of columns for the grid (12 characters per row)
  const columns = 12

  // Calculate rows based on page format
  const rows = pageFormat === "halfPage" ? 6 : 12

  // Add print-specific styles
  iframeDoc.write(`
    <html>
      <head>
        <title>Jap'App - Print</title>
        <style>
          @page {
            margin: 0.7cm;
            size: A4;
          }
          html, body {
            font-family: system-ui, -apple-system, sans-serif;
            padding: 0;
            margin: 0;
            width: 100%;
            height: 100%;
          }
          .print-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .page-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ddd;
            font-size: 12px;
            color: #666;
          }
          .exercise-section {
            break-inside: avoid;
            margin-bottom: 15px;
          }
          .exercise-grid {
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            gap: 5px;
          }
          .character-cell {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .character {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 35px;
            height: 35px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: rgba(0, 0, 0, 0.03);
            font-size: 16px;
          }
          .writing-box {
            position: relative;
            margin-top: 2px;
            width: 35px;
            height: 35px;
            border: 1px dashed #ddd;
            border-radius: 4px;
          }
          .writing-box::before, .writing-box::after {
            content: "";
            position: absolute;
            background-color: #ddd;
            opacity: 0.5;
          }
          .writing-box::before {
            /* Horizontal line */
            width: 100%;
            height: 1px;
            top: 50%;
            left: 0;
          }
          .writing-box::after {
            /* Vertical line */
            width: 1px;
            height: 100%;
            top: 0;
            left: 50%;
          }
          .correction-grid {
            margin-top: 5px;
            border-top: 1px solid #eee;
            padding-top: 3px;
          }
          .correction-text {
            font-size: 16px;
            font-weight: 500;
          }
          @media print {
            body { margin: 0; padding: 0; }
            .page-break { page-break-before: always; break-before: page; }
            .no-break { page-break-inside: avoid; break-inside: avoid; }
          }
        </style>
      </head>
      <body>
  `)

  // Create exercise content
  let exerciseContent = `<div class="print-container">`

  // Process each exercise
  exercises.forEach((exercise, exerciseIndex) => {
    // Use the exercise properties if available, otherwise use the props
    const exerciseDirection = exercise.direction || direction
    const exercisePageFormat = exercise.pageFormat || pageFormat
    const exerciseType = exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)

    // Format direction for display
    const directionDisplay = exerciseDirection === "syllabaryToRomaji" ? "Syllabaire → Romaji" : "Romaji → Syllabaire"

    // Start a new page for each exercise (except the first one)
    if (exerciseIndex > 0) {
      exerciseContent += `<div class="page-break"></div>`
    }

    // Add page header with exercise number, type and direction
    const pageNumber = exercises.length > 1 ? ` ${exerciseIndex + 1}` : ""
    exerciseContent += `
      <div class="page-header">
        <span class="logo"><span style="color: #e32c2c; font-weight: bold;">Jap'</span>App</span> - <span>Exercice${pageNumber} - ${exerciseType} - ${directionDisplay}</span>
      </div>
    `

    exerciseContent += `
      <div class="exercise-section no-break">
        <div class="exercise-grid">
    `

    // Calculate how many characters to display based on page format
    const charactersPerPage = exercisePageFormat === "halfPage" ? 72 : 144

    // Ensure we have enough characters in the grid
    const gridToUse = exercise.grid
    if (gridToUse.length < charactersPerPage) {
      console.warn(`Grid has only ${gridToUse.length} characters, but ${charactersPerPage} are needed.`)
    }

    // Display all characters up to the required count
    for (let i = 0; i < charactersPerPage; i++) {
      // If we run out of characters, use the last one as a fallback
      const item = i < gridToUse.length ? gridToUse[i] : gridToUse[gridToUse.length - 1]

      exerciseContent += `
        <div class="character-cell">
          <div class="character">${exerciseDirection === "syllabaryToRomaji" ? item.char : item.romaji}</div>
          <div class="writing-box"></div>
        </div>
      `
    }

    exerciseContent += `</div>`

    // Add correction grid
    if (showCorrection) {
      // For full page format, add a page break before correction
      if (exercisePageFormat === "fullPage") {
        exerciseContent += `<div class="page-break"></div>`

        // Add page header with correction number, type and direction
        const correctionNumber = exercises.length > 1 ? ` ${exerciseIndex + 1}` : ""
        exerciseContent += `
          <div class="page-header">
            <span class="logo"><span style="color: #e32c2c; font-weight: bold;">Jap'</span>App</span> - <span>Correction${correctionNumber} - ${exerciseType} - ${directionDisplay}</span>
          </div>
        `
      }

      exerciseContent += `
        <div class="correction-grid no-break">
          <div class="exercise-grid">
      `

      // Display all characters for correction
      for (let i = 0; i < charactersPerPage; i++) {
        // If we run out of characters, use the last one as a fallback
        const item = i < gridToUse.length ? gridToUse[i] : gridToUse[gridToUse.length - 1]

        exerciseContent += `
          <div class="character-cell">
            <div class="character">${exerciseDirection === "syllabaryToRomaji" ? item.char : item.romaji}</div>
            <div class="writing-box">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" class="correction-text">
                ${exerciseDirection === "syllabaryToRomaji" ? item.romaji : item.char}
              </div>
            </div>
          </div>
        `
      }

      exerciseContent += `</div></div>`
    }

    exerciseContent += `</div>`
  })

  exerciseContent += `</div>`

  // Complete the HTML document
  iframeDoc.write(exerciseContent)
  iframeDoc.write(`
      </body>
    </html>
  `)

  iframeDoc.close()

  // If debug mode is enabled, open in a new window instead of printing
  if (debug) {
    const debugWindow = window.open("", "_blank")
    if (debugWindow) {
      debugWindow.document.write(iframeDoc.documentElement.outerHTML)
      debugWindow.document.close()
    } else {
      alert("Please allow pop-ups to debug the print layout")
    }
    // Remove the iframe
    document.body.removeChild(iframe)
    return
  }

  // Wait for content to load then print
  setTimeout(() => {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()

    // Remove the iframe after printing (or after a timeout)
    setTimeout(() => {
      document.body.removeChild(iframe)
    }, 1000)
  }, 500)
}

// Helper function to open the print preview in a new window for debugging
export function debugPrintDocument(
  exercises: Exercise[],
  showCorrection: boolean,
  direction: "syllabaryToRomaji" | "romajiToSyllabary" = "syllabaryToRomaji",
  pageFormat: "halfPage" | "fullPage" = "halfPage",
) {
  printDocument(exercises, showCorrection, direction, pageFormat, true)
}
