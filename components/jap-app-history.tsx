import { Button } from "@/components/ui/button";
import { Clock, AlertCircle } from "lucide-react";
import { HistoryItem } from "./history-item";
import { JapAppState, JapAppAction } from "@/lib/types/jap-app-types";
import { Locale } from "@/i18n/i18nConfig";
import { Exercise } from "@/lib/types";

interface JapAppHistoryProps {
  state: JapAppState;
  dispatch: React.Dispatch<JapAppAction>;
  d: Record<string, string>;
  locale: Locale;
  onLoadFromHistory: (exercise: Exercise) => void;
}

export function JapAppHistory({
  state,
  dispatch,
  d,
  locale,
  onLoadFromHistory,
}: JapAppHistoryProps) {
  const clearHistory = () => {
    dispatch({ type: "CLEAR_HISTORY" });
    if (typeof window !== "undefined") {
      localStorage.removeItem("kana-history");
    }
  };

  const removeHistoryItem = (id: string) => {
    dispatch({ type: "REMOVE_FROM_HISTORY", payload: id });
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center text-xl font-semibold">
          <Clock className="mr-2 h-5 w-5" />
          {d.history}
        </h2>
        {state.history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearHistory}
            className="text-destructive hover:text-destructive"
          >
            <AlertCircle className="mr-2 h-4 w-4" />
            {d.clearHistory}
          </Button>
        )}
      </div>

      {state.history.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {state.history.map((item) => (
            <HistoryItem
              locale={locale}
              key={item.id}
              exercise={item}
              onLoad={() => onLoadFromHistory(item)}
              onDelete={() => removeHistoryItem(item.id)}
              d={d}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          {d.noHistory}
        </div>
      )}
    </div>
  );
}
