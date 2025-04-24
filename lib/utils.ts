import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SyllabarySubset } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const syllabarySubsetsRecord: Record<SyllabarySubset, string> = {
  gojuon: "Gojūon",
  dakuten: "Dakuten",
  handakuten: "Handakuten",
  yoon: "Yōon",
};
