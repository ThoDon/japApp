"use client";

import { formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, ExternalLink } from "lucide-react";

interface HistoryItemProps {
  exercise: {
    id: string;
    type: string;
    direction?: "syllabaryToRomaji" | "romajiToSyllabary";
    pageFormat?: "halfPage" | "fullPage";
    grid: { char: string; romaji: string }[];
    timestamp: number;
  };
  onLoad: () => void;
  onDelete: () => void;
  locale: string;
  d: Record<string, string>;
}

export function HistoryItem({
  exercise,
  onLoad,
  onDelete,
  locale,
  d,
}: HistoryItemProps) {
  const getTimeAgo = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: locale === "fr" ? fr : enUS,
    });
  };

  // Determine what to display based on direction
  const displayChar = (item: { char: string; romaji: string }) => {
    if (!exercise.direction || exercise.direction === "syllabaryToRomaji") {
      return item.char;
    }
    return item.romaji;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium capitalize">{exercise.type}</h3>
          <span className="text-sm text-muted-foreground">
            {d[exercise.pageFormat || "halfPage"]}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {exercise.grid.slice(0, 8).map((item, index) => (
            <div
              key={index}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/20 bg-primary/5 text-sm"
            >
              {displayChar(item)}
            </div>
          ))}
        </div>

        <div className="mt-2 flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {getTimeAgo(exercise.timestamp)}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between p-4 pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 px-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={onLoad} className="h-8">
          <ExternalLink className="mr-2 h-4 w-4" />
          {d.load}
        </Button>
      </CardFooter>
    </Card>
  );
}
