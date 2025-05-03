import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import {
  DirectionType,
  PageFormatType,
  SyllabaryType,
  SyllabarySubset,
  CharSubset,
} from "@/lib/types";
import CheckboxGroup from "../shared/checkbox-group";
import { GeneratorState, GeneratorAction } from "@/lib/types";
import {
  charSubsetsRecord,
  syllabarySubsetsRecord,
} from "@/lib/japanese-utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GeneratorControlsProps {
  state: GeneratorState;
  dispatch: React.Dispatch<GeneratorAction>;
  d: Record<string, string>;
}

export function GeneratorControls({
  state,
  dispatch,
  d,
}: GeneratorControlsProps) {
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
              {d[state.syllabaryType]} &rarr; {d.romaji}
            </TabsTrigger>
            <TabsTrigger value="romajiToSyllabary">
              {d.romaji} &rarr; {d[state.syllabaryType]}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <Label className="mb-2">{d.charSubsets}</Label>
        <CheckboxGroup
          values={state.charSubsets}
          options={Object.entries(charSubsetsRecord).map(([key, value]) => ({
            id: key,
            label: value,
          }))}
          onChange={(selectedIds: string[]) => {
            dispatch({
              type: "SET_CHAR_SUBSETS",
              payload: selectedIds as CharSubset[],
            });
          }}
        />
      </div>

      <div>
        <Label className="mb-2">{d.category}</Label>
        <CheckboxGroup
          values={state.syllabarySubsets}
          options={Object.entries(syllabarySubsetsRecord).map(
            ([key, value]) => ({ id: key, label: value })
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
        <Select
          value={state.pageCount?.toString()}
          onValueChange={(value: string) =>
            dispatch({ type: "SET_PAGE_COUNT", payload: parseInt(value) })
          }
        >
          <SelectTrigger className="mt-2 w-full">
            <SelectValue placeholder="Select pages" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <SelectItem key={num} value={num.toString()}>
                {num}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
