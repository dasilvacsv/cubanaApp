"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import CustomDatePicker from "@/components/ui/CustomDatePicker";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  type?: "text" | "select" | "date";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  className = "",
  type = "text",
  required = false,
  options = [],
}: FormFieldProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      const syntheticEvent = {
        target: {
          name,
          value: formattedDate,
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  if (type === "select" && options.length > 0) {
    return (
      <div className={cn("flex flex-col", className)}>
        <label htmlFor={name} className="text-xs font-medium mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
          className="border border-gray-300 rounded-sm px-2 py-1 text-sm no-print"
          required={required}
        >
          <option value="">--</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="print-only text-xs">
          {options.find(opt => opt.value === value)?.label || ''}
        </div>
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className={cn("flex flex-col", className)}>
        <label htmlFor={name} className="text-xs font-medium mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start font-normal no-print text-left h-8"
            >
              {value ? format(new Date(value), "dd/MM/yyyy") : "Seleccionar fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CustomDatePicker
              selected={value ? new Date(value) : undefined}
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
        <div className="print-only text-xs print-date">
          {value ? format(new Date(value), "dd/MM/yyyy") : ""}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={name} className="text-xs font-medium mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-sm px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 no-print"
        required={required}
      />
      <div className="print-only text-xs print-id">
        {value}
      </div>
    </div>
  );
}