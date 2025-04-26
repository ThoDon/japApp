import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import CheckboxGroup from "./checkbox-group";
import { JapAppState, JapAppAction } from "@/lib/types/jap-app-types";
import { syllabarySubsetsRecord } from "@/lib/utils";
import {
  DirectionType,
  PageFormatType,
  SyllabaryType,
  SyllabarySubset,
} from "@/lib/types";

interface JapAppControlsProps {
  state: JapAppState;
  dispatch: React.Dispatch<JapAppAction>;
  d: Record<string, string>;
}

export function JapAppControls({ state, dispatch, d }: JapAppControlsProps) {
  const handlePageCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number.parseInt(value);
    // Allow any input while typing, including empty
    if (value === "" || !isNaN(numValue)) {
      dispatch({
        type: "SET_PAGE_COUNT",
        payload: value === "" ? undefined : numValue,
      });
    }
  };

  const handlePageCountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = Number.parseInt(value);
    // Only validate and set constraints on blur
    if (value === "" || isNaN(numValue) || numValue < 1) {
      dispatch({ type: "SET_PAGE_COUNT", payload: 1 });
    } else if (numValue > 10) {
      dispatch({ type: "SET_PAGE_COUNT", payload: 10 });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>{d.syllabaryType}</Label>
        <Tabs
          defaultValue="hiragana"
          value={state.syllabaryType}
          onValueChange={(value) =>
            dispatch({
              type: "SET_SYLLABARY_TYPE",
              payload: value as SyllabaryType,
            })
          }
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hiragana">{d.hiragana}</TabsTrigger>
            <TabsTrigger value="katakana">{d.katakana}</TabsTrigger>
            <div className="relative">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <TabsTrigger
                        value="kanji"
                        disabled
                        className="flex w-full items-center gap-1"
                      >
                        {d.kanji}
                        <AlertCircle className="h-4 w-4" />
                      </TabsTrigger>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{d.comingSoon}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <Label>{d.direction}</Label>
        <Tabs
          defaultValue="syllabaryToRomaji"
          value={state.direction}
          onValueChange={(value) =>
            dispatch({
              type: "SET_DIRECTION",
              payload: value as DirectionType,
            })
          }
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="syllabaryToRomaji">
              {d[state.syllabaryType]} --&gt; {d.romaji}
            </TabsTrigger>
            <TabsTrigger value="romajiToSyllabary">
              {d.romaji} --&gt; {d[state.syllabaryType]}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <Label className="mb-2">{d.category}</Label>
        <CheckboxGroup
          values={state.syllabarySubsets}
          options={Object.entries(syllabarySubsetsRecord).map(
            ([key, value]) => ({
              id: key,
              label: value,
            })
          )}
          onChange={(selectedIds: string[]) => {
            dispatch({
              type: "SET_SYLLABARY_SUBSETS",
              payload: selectedIds as SyllabarySubset[],
            });
          }}
        />
      </div>

      <div>
        <Label>{d.pageFormat}</Label>
        <Tabs
          defaultValue="halfPage"
          value={state.pageFormat}
          onValueChange={(value) =>
            dispatch({
              type: "SET_PAGE_FORMAT",
              payload: value as PageFormatType,
            })
          }
          className="mt-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="halfPage">{d.halfPage}</TabsTrigger>
            <TabsTrigger value="fullPage">{d.fullPage}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <Label htmlFor="page-count">{d.numberOfPages}</Label>
        <Input
          id="page-count"
          type="number"
          min={1}
          max={10}
          value={state.pageCount}
          onChange={handlePageCountChange}
          onBlur={handlePageCountBlur}
          className="mt-2"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="show-correction"
          checked={state.showCorrection}
          onCheckedChange={(checked) =>
            dispatch({ type: "SET_SHOW_CORRECTION", payload: checked })
          }
        />
        <Label htmlFor="show-correction">{d.showCorrection}</Label>
      </div>
    </div>
  );
}
