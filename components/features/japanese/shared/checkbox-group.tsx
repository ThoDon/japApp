"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxOption {
  id: string;
  label: string;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  values: string[];
  onChange?: (selectedIds: string[]) => void;
}

export default function CheckboxGroup({
  options,
  values = [],
  onChange,
}: CheckboxGroupProps) {
  const handleCheckboxChange = (id: string, checked: boolean) => {
    const updatedSelection = checked
      ? [...values, id]
      : values.filter((item) => item !== id);

    onChange?.(updatedSelection);
  };

  return (
    <div className="flex flex-wrap gap-4 md:gap-6">
      {options.map((option) => {
        const isChecked = values.includes(option.id);
        const shouldDisable = values.length === 1 && isChecked;

        return (
          <div key={option.id} className="flex items-center space-x-2">
            <Checkbox
              id={option.id}
              checked={isChecked}
              disabled={shouldDisable}
              onCheckedChange={(checked) =>
                handleCheckboxChange(option.id, checked as boolean)
              }
            />
            <Label
              htmlFor={option.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
