"use client"

import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

interface Exercise {
  id: string
  type: string
  size: string
  direction?: "syllabaryToRomaji" | "romajiToSyllabary"
  grid: { char: string; romaji: string }[]
}

// Function to create a print-friendly version of the exercises
export function printDocument(
  exercises: Exercise[],
  showCorrection: boolean,
  characterSize: string,
  direction: "syllabaryToRomaji" | "romajiToSyllabary" = "syllabaryToRomaji",
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

  // Calculate columns based on character size
  const columns = characterSize === "small" ? 6 : characterSize === "large" ? 4 : 5

  // Add print-specific styles
  iframeDoc.write(`
    <html>
      <head>
        <title>Jap'App - Print</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            padding: 20px;
          }
          .print-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .exercise-section {
            page-break-inside: avoid;
            margin-bottom: 30px;
          }
          .exercise-grid {
            display: grid;
            grid-template-columns: repeat(${columns}, 1fr);
            gap: 15px;
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
            width: ${characterSize === "small" ? "40px" : characterSize === "large" ? "60px" : "50px"};
            height: ${characterSize === "small" ? "40px" : characterSize === "large" ? "60px" : "50px"};
            border: 1px solid #ddd;
            border-radius: 6px;
            background-color: rgba(0, 0, 0, 0.03);
            font-size: ${characterSize === "small" ? "18px" : characterSize === "large" ? "28px" : "22px"};
          }
          .writing-box {
            position: relative;
            margin-top: 8px;
            width: ${characterSize === "small" ? "60px" : characterSize === "large" ? "90px" : "75px"};
            height: ${characterSize === "small" ? "60px" : characterSize === "large" ? "90px" : "75px"};
            border: 1px dashed #ddd;
            border-radius: 6px;
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
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
          h2 {
            margin-top: 0;
            margin-bottom: 15px;
            font-size: 18px;
          }
          @media print {
            body { margin: 0; padding: 15px; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
  `)

  // Create exercise content
  let exerciseContent = `<div class="print-container">`

  // Process each exercise
  exercises.forEach((exercise, index) => {
    // Use the exercise direction if available, otherwise use the prop
    const exerciseDirection = exercise.direction || direction

    exerciseContent += `
      <div class="exercise-section">
        <h2>${exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}</h2>
        <div class="exercise-grid">
    `

    exercise.grid.forEach((item) => {
      exerciseContent += `
        <div class="character-cell">
          <div class="character">${exerciseDirection === "syllabaryToRomaji" ? item.char : item.romaji}</div>
          <div class="writing-box"></div>
        </div>
      `
    })

    exerciseContent += `</div>`

    // Add correction grid if enabled
    if (showCorrection) {
      exerciseContent += `
        <div class="correction-grid">
          <h2>Correction</h2>
          <div class="exercise-grid">
      `

      exercise.grid.forEach((item) => {
        exerciseContent += `
          <div class="character-cell">
            <div class="character">${exerciseDirection === "syllabaryToRomaji" ? item.char : item.romaji}</div>
            <div class="writing-box">
              <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: ${characterSize === "small" ? "14px" : characterSize === "large" ? "20px" : "16px"};">
                ${exerciseDirection === "syllabaryToRomaji" ? item.romaji : item.char}
              </div>
            </div>
          </div>
        `
      })

      exerciseContent += `</div></div>`
    }

    exerciseContent += `</div>`

    // Add page break if needed
    if (index < exercises.length - 1) {
      exerciseContent += `<div class="page-break"></div>`
    }
  })

  exerciseContent += `</div>`

  // Complete the HTML document
  iframeDoc.write(exerciseContent)
  iframeDoc.write(`
      </body>
    </html>
  `)

  iframeDoc.close()

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

// Function to download exercises as PDF
export async function downloadPDF(exercises: Exercise[], showCorrection: boolean, characterSize: string) {
  // Create a temporary container for the PDF content
  const container = document.createElement("div")
  container.style.position = "absolute"
  container.style.left = "-9999px"
  container.style.top = "-9999px"
  document.body.appendChild(container)

  // Add styles similar to the print function
  container.innerHTML = `
    <div style="padding: 20px; font-family: system-ui, -apple-system, sans-serif;">
      <div style="display: flex; flex-direction: ${exercises.length > 2 || !showCorrection ? "column" : "row"}; gap: 20px;">
  `

  // Exercise section
  let exerciseSection = `<div>`
  exercises.forEach((exercise) => {
    exerciseSection += `
      <div style="margin-bottom: 30px;">
        <h2 style="margin-top: 0; margin-bottom: 15px; font-size: 18px;">
          ${exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
        </h2>
        <div style="display: grid; grid-template-columns: repeat(${characterSize === "small" ? "5" : characterSize === "large" ? "3" : "4"}, 1fr); gap: 15px;">
    `

    exercise.grid.forEach((item) => {
      exerciseSection += `
        <div style="display: flex; flex-direction: column; align-items: center;">
          <div style="display: flex; align-items: center; justify-content: center; width: ${characterSize === "small" ? "50px" : characterSize === "large" ? "80px" : "65px"}; height: ${characterSize === "small" ? "50px" : characterSize === "large" ? "80px" : "65px"}; border: 1px solid #ddd; border-radius: 6px; background-color: rgba(0, 0, 0, 0.03); font-size: ${characterSize === "small" ? "18px" : characterSize === "large" ? "28px" : "22px"};">
            ${item.char}
          </div>
          <div style="margin-top: 8px; width: ${characterSize === "small" ? "50px" : characterSize === "large" ? "80px" : "65px"}; height: 30px; border: 1px dashed #ddd; border-radius: 6px;"></div>
        </div>
      `
    })

    exerciseSection += `</div></div>`
  })
  exerciseSection += `</div>`

  container.querySelector("div > div")!.innerHTML += exerciseSection

  // Correction section (if enabled)
  if (showCorrection) {
    let correctionSection = `<div>`
    exercises.forEach((exercise) => {
      correctionSection += `
        <div style="margin-bottom: 30px;">
          <h2 style="margin-top: 0; margin-bottom: 15px; font-size: 18px;">
            Correction - ${exercise.type.charAt(0).toUpperCase() + exercise.type.slice(1)}
          </h2>
          <div style="display: grid; grid-template-columns: repeat(${characterSize === "small" ? "5" : characterSize === "large" ? "3" : "4"}, 1fr); gap: 15px;">
      `

      exercise.grid.forEach((item) => {
        correctionSection += `
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="display: flex; align-items: center; justify-content: center; width: ${characterSize === "small" ? "50px" : characterSize === "large" ? "80px" : "65px"}; height: ${characterSize === "small" ? "50px" : characterSize === "large" ? "80px" : "65px"}; border: 1px solid #ddd; border-radius: 6px; background-color: rgba(0, 0, 0, 0.03); font-size: ${characterSize === "small" ? "18px" : characterSize === "large" ? "28px" : "22px"};">
              ${item.char}
            </div>
            <div style="margin-top: 8px; width: ${characterSize === "small" ? "50px" : characterSize === "large" ? "80px" : "65px"}; height: 30px; border: 1px solid #ddd; border-radius: 6px; display: flex; align-items: center; justify-content: center;">
              ${item.romaji}
            </div>
          </div>
        `
      })

      correctionSection += `</div></div>`
    })
    correctionSection += `</div>`

    container.querySelector("div > div")!.innerHTML += correctionSection
  }

  container.innerHTML += `</div></div>`

  try {
    // Create PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 1,
      useCORS: true,
      logging: false,
    })

    // Add canvas to PDF
    const imgData = canvas.toDataURL("image/png")
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const ratio = canvas.width / canvas.height
    const imgWidth = pdfWidth
    const imgHeight = pdfWidth / ratio

    // If the content is too tall for one page, split it across multiple pages
    if (imgHeight > pdfHeight) {
      const pageCount = Math.ceil(imgHeight / pdfHeight)
      let heightLeft = imgHeight
      let position = 0

      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage()
        }

        const heightToDraw = Math.min(pdfHeight, heightLeft)
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight, undefined, "FAST")

        heightLeft -= pdfHeight
        position -= pdfHeight
      }
    } else {
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight)
    }

    // Download the PDF
    pdf.save(`japapp-exercises-${new Date().toISOString().slice(0, 10)}.pdf`)
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("Failed to generate PDF. Please try again.")
  } finally {
    // Clean up
    document.body.removeChild(container)
  }
}
