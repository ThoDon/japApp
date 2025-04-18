"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Printer, RefreshCw, Clock, AlertCircle, Bug } from "lucide-react"
import { generateGrid } from "@/lib/japanese-utils"
import { printDocument, debugPrintDocument } from "@/lib/print-utils"
import { ExerciseGrid } from "@/components/exercise-grid"
import { HistoryItem } from "@/components/history-item"
import { useTranslations } from "@/hooks/use-translations"

type SyllabaryType = "hiragana" | "katakana" | "kanji"
type DirectionType = "syllabaryToRomaji" | "romajiToSyllabary"
type PageFormatType = "halfPage" | "fullPage"

interface Exercise {
  id: string
  type: SyllabaryType
  direction: DirectionType
  pageFormat: PageFormatType
  grid: { char: string; romaji: string }[]
  timestamp: number
}

// Calculate the number of characters per page based on the page format
const getCharactersPerPage = (format: PageFormatType): number => {
  return format === "halfPage" ? 72 : 144 // 12x6 for half page, 12x12 for full page
}

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === "development"

export function JapAppGenerator() {
  const { t } = useTranslations()

  const [syllabaryType, setSyllabaryType] = useState<SyllabaryType>("hiragana")
  const [pageCount, setPageCount] = useState<number>(1)
  const [showCorrection, setShowCorrection] = useState<boolean>(true)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [history, setHistory] = useState<Exercise[]>([])
  const [direction, setDirection] = useState<DirectionType>("syllabaryToRomaji")
  const [pageFormat, setPageFormat] = useState<PageFormatType>("halfPage")

  // Load history from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("japapp-history")
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory))
        } catch (e) {
          console.error("Failed to parse history:", e)
        }
      }
    }
  }, [])

  // Save history to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("japapp-history", JSON.stringify(history))
    }
  }, [history])

  // Generate new exercises when parameters change
  useEffect(() => {
    if (exercises.length > 0) {
      generateExercises()
    }
  }, [syllabaryType, direction, pageFormat]) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePageCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setPageCount(value)
    } else {
      setPageCount(1)
    }
  }

  const generateExercises = () => {
    const charactersPerPage = getCharactersPerPage(pageFormat)

    const newExercises = Array.from({ length: pageCount }, (_, i) => {
      // Generate enough characters for the page format
      // For full page, we need to ensure we have 144 characters
      const grid = generateGrid(syllabaryType, charactersPerPage)

      // Ensure we have enough characters (in case generateGrid doesn't return enough)
      while (grid.length < charactersPerPage) {
        const moreChars = generateGrid(syllabaryType, charactersPerPage - grid.length)
        grid.push(...moreChars)
      }

      return {
        id: `${Date.now()}-${i}`,
        type: syllabaryType,
        direction,
        pageFormat,
        grid,
        timestamp: Date.now(),
      }
    })

    setExercises(newExercises)

    // Add to history (limit to 10 items)
    setHistory((prev) => {
      const combined = [...newExercises, ...prev]
      return combined.slice(0, 10)
    })
  }

  const handlePrint = () => {
    printDocument(exercises, showCorrection, direction, pageFormat)
  }

  const handleDebugPrint = () => {
    debugPrintDocument(exercises, showCorrection, direction, pageFormat)
  }

  const clearHistory = () => {
    setHistory([])
    if (typeof window !== "undefined") {
      localStorage.removeItem("japapp-history")
    }
  }

  const removeHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id))
  }

  const loadFromHistory = (exercise: Exercise) => {
    setExercises([exercise])
    setSyllabaryType(exercise.type)
    setDirection(exercise.direction || "syllabaryToRomaji")
    setPageFormat(exercise.pageFormat || "halfPage")
    setPageCount(1)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label>{t("syllabaryType")}</Label>
                <Tabs
                  defaultValue="hiragana"
                  value={syllabaryType}
                  onValueChange={(value) => setSyllabaryType(value as SyllabaryType)}
                  className="mt-2"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="hiragana">{t("hiragana")}</TabsTrigger>
                    <TabsTrigger value="katakana">{t("katakana")}</TabsTrigger>
                    <div className="relative">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <TabsTrigger value="kanji" disabled className="flex w-full items-center gap-1">
                                {t("kanji")}
                                <AlertCircle className="h-4 w-4" />
                              </TabsTrigger>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{t("comingSoon")}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <Label>{t("direction")}</Label>
                <Tabs
                  defaultValue="syllabaryToRomaji"
                  value={direction}
                  onValueChange={(value) => setDirection(value as DirectionType)}
                  className="mt-2"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="syllabaryToRomaji">{t("syllabaryToRomaji")}</TabsTrigger>
                    <TabsTrigger value="romajiToSyllabary">{t("romajiToSyllabary")}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <Label>{t("pageFormat")}</Label>
                <Tabs
                  defaultValue="halfPage"
                  value={pageFormat}
                  onValueChange={(value) => setPageFormat(value as PageFormatType)}
                  className="mt-2"
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="halfPage">{t("halfPage")}</TabsTrigger>
                    <TabsTrigger value="fullPage">{t("fullPage")}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div>
                <Label htmlFor="page-count">{t("numberOfPages")}</Label>
                <Input
                  id="page-count"
                  type="number"
                  min="1"
                  value={pageCount}
                  onChange={handlePageCountChange}
                  className="mt-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="show-correction" checked={showCorrection} onCheckedChange={setShowCorrection} />
                <Label htmlFor="show-correction">{t("showCorrection")}</Label>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-medium">{t("preview")}</h3>
                {exercises.length > 0 ? (
                  <div className="max-h-40 overflow-auto">
                    <ExerciseGrid
                      exercise={exercises[0]}
                      showCorrection={showCorrection}
                      isPreview={true}
                      direction={direction}
                      pageFormat={pageFormat}
                    />
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center text-muted-foreground">
                    {t("generateToPreview")}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Button onClick={generateExercises} className="w-full">
                  {exercises.length > 0 ? <RefreshCw className="mr-2 h-4 w-4" /> : null}
                  {exercises.length > 0 ? t("regenerate") : t("generate")}
                </Button>

                <div className="flex gap-2">
                  <Button onClick={handlePrint} variant="outline" disabled={exercises.length === 0} className="flex-1">
                    <Printer className="mr-2 h-4 w-4" />
                    {t("print")}
                  </Button>

                  {isDevelopment && (
                    <Button
                      onClick={handleDebugPrint}
                      variant="outline"
                      disabled={exercises.length === 0}
                      className="w-10 px-0"
                      title="Debug Print"
                    >
                      <Bug className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center text-xl font-semibold">
            <Clock className="mr-2 h-5 w-5" />
            {t("history")}
          </h2>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="text-destructive hover:text-destructive"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              {t("clearHistory")}
            </Button>
          )}
        </div>

        {history.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <HistoryItem
                key={item.id}
                exercise={item}
                onLoad={() => loadFromHistory(item)}
                onDelete={() => removeHistoryItem(item.id)}
                t={t}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-8 text-center text-muted-foreground">{t("noHistory")}</div>
        )}
      </div>
    </div>
  )
}
