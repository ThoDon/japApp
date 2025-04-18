"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Printer, RefreshCw, Clock, AlertCircle } from "lucide-react"
import { generateGrid } from "@/lib/japanese-utils"
import { printDocument } from "@/lib/print-utils"
import { ExerciseGrid } from "@/components/exercise-grid"
import { HistoryItem } from "@/components/history-item"
import { useTranslations } from "@/hooks/use-translations"

type SyllabaryType = "hiragana" | "katakana" | "kanji"
type SizeType = "small" | "normal" | "large"
type DirectionType = "syllabaryToRomaji" | "romajiToSyllabary"

interface Exercise {
  id: string
  type: SyllabaryType
  size: SizeType
  direction: DirectionType
  characterCount: number
  grid: { char: string; romaji: string }[]
  timestamp: number
}

export function JapAppGenerator() {
  const { t } = useTranslations()

  const [syllabaryType, setSyllabaryType] = useState<SyllabaryType>("hiragana")
  const [characterSize, setCharacterSize] = useState<SizeType>("normal")
  const [gridCount, setGridCount] = useState<number>(1)
  const [showCorrection, setShowCorrection] = useState<boolean>(true)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [history, setHistory] = useState<Exercise[]>([])
  const [direction, setDirection] = useState<DirectionType>("syllabaryToRomaji")
  const [characterCount, setCharacterCount] = useState<number>(20)

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

  const generateExercises = () => {
    const newExercises = Array.from({ length: gridCount }, (_, i) => ({
      id: `${Date.now()}-${i}`,
      type: syllabaryType,
      size: characterSize,
      direction,
      characterCount,
      grid: generateGrid(syllabaryType, characterCount),
      timestamp: Date.now(),
    }))

    setExercises(newExercises)

    // Add to history (limit to 10 items)
    setHistory((prev) => {
      const combined = [...newExercises, ...prev]
      return combined.slice(0, 10)
    })
  }

  const handlePrint = () => {
    printDocument(exercises, showCorrection, characterSize, direction)
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
    setCharacterSize(exercise.size)
    setDirection(exercise.direction || "syllabaryToRomaji")
    setCharacterCount(exercise.characterCount || 20)
    setGridCount(1)
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <TabsTrigger value="kanji" disabled className="flex items-center gap-1">
                            {t("kanji")}
                            <AlertCircle className="h-4 w-4" />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t("comingSoon")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
                <Label htmlFor="character-count">{t("characterCount")}</Label>
                <Select
                  value={characterCount.toString()}
                  onValueChange={(value) => setCharacterCount(Number.parseInt(value))}
                >
                  <SelectTrigger id="character-count" className="mt-2">
                    <SelectValue placeholder={t("selectCharacterCount")} />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 80, 100, 150, 200].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="grid-count">{t("numberOfGrids")}</Label>
                <Select value={gridCount.toString()} onValueChange={(value) => setGridCount(Number.parseInt(value))}>
                  <SelectTrigger id="grid-count" className="mt-2">
                    <SelectValue placeholder={t("selectGridCount")} />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="character-size">{t("characterSize")}</Label>
                <Select value={characterSize} onValueChange={(value) => setCharacterSize(value as SizeType)}>
                  <SelectTrigger id="character-size" className="mt-2">
                    <SelectValue placeholder={t("selectSize")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">{t("small")}</SelectItem>
                    <SelectItem value="normal">{t("normal")}</SelectItem>
                    <SelectItem value="large">{t("large")}</SelectItem>
                  </SelectContent>
                </Select>
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

                <Button onClick={handlePrint} variant="outline" disabled={exercises.length === 0} className="w-full">
                  <Printer className="mr-2 h-4 w-4" />
                  {t("print")}
                </Button>
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
