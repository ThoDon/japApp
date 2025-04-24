"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { redirect } from "next/navigation";
import { Locale, i18n } from "../i18n/i18nConfig";
import { cn } from "../lib/utils";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const redirectToLocale = (newLocale: string) => {
    redirect(`/${newLocale}`);
  };

  const getLocalizedLanguage = (locale: string): Intl.DisplayNames => {
    return new Intl.DisplayNames([locale], {
      type: "language",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Change language"
          className="cursor-pointer"
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => redirectToLocale(loc)}
            className={cn("capitalize cursor-pointer", {
              "bg-muted": locale === loc,
            })}
          >
            {getLocalizedLanguage(loc).of(loc)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
