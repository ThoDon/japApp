"use client";

import { formatDistanceToNow } from "date-fns";
import { fr, enUS, es, de, it, pt, zhCN } from "date-fns/locale";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Trash2, ExternalLink } from "lucide-react";
import { ExerciseGrid } from "./exercise-grid";
import { Locale } from "../i18nConfig";

import type { Exercise } from "../lib/types";

interface HistoryItemProps {
  exercise: Exercise;
  onLoad: () => void;
  onDelete: () => void;
  locale: Locale;
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
    const localRecord = {
      fr: fr,
      en: enUS,
      es: es,
      de: de,
      it: it,
      pt: pt,
      zh: zhCN,
    };
    return formatDistanceToNow(new Date(timestamp), {
      addSuffix: true,
      locale: localRecord[locale],
    });
  };

  return (
    <Card className="py-0">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-medium capitalize">{exercise.type}</h3>
          <span className="text-sm text-muted-foreground">
            {d[exercise.pageFormat]}
          </span>
        </div>
        <ExerciseGrid exercise={exercise} />
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
