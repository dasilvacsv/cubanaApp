"use client";

import { useState, useEffect, useMemo } from "react";
import { es } from "date-fns/locale";
import { format, getYear, getMonth, getDate, isValid, lastDayOfMonth } from "date-fns";

interface CustomDatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  fromYear?: number;
  toYear?: number;
}

const CustomDatePicker = ({ selected, onSelect, fromYear = 1900, toYear = new Date().getFullYear() + 1 }: CustomDatePickerProps) => {
  const [currentDate, setCurrentDate] = useState<Date>(selected || new Date());
  const [viewMode, setViewMode] = useState<"year" | "month" | "day">("year");
  const [yearSearch, setYearSearch] = useState("");
  const [monthSearch, setMonthSearch] = useState("");
  const [daySearch, setDaySearch] = useState("");
  
  // Generar años con búsqueda
  const filteredYears = useMemo(() => {
    const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => fromYear + i);
    return years.filter(year => 
      year.toString().toLowerCase().includes(yearSearch.toLowerCase())
    );
  }, [fromYear, toYear, yearSearch]);

  // Generar meses con búsqueda
  const filteredMonths = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      value: i,
      name: format(new Date(2000, i, 1), "MMMM", { locale: es })
    }));
    return months.filter(month => 
      month.name.toLowerCase().includes(monthSearch.toLowerCase())
    );
  }, [monthSearch]);

  // Generar días con búsqueda
  const filteredDays = useMemo(() => {
    const days = Array.from({ length: lastDayOfMonth(currentDate).getDate() }, (_, i) => i + 1);
    return days.filter(day => 
      day.toString().toLowerCase().includes(daySearch.toLowerCase())
    );
  }, [currentDate, daySearch]);

  const handleYearSelect = (year: number) => {
    const newDate = new Date(year, getMonth(currentDate), getDate(currentDate));
    setCurrentDate(newDate);
    setViewMode("month");
    setYearSearch("");
  };

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(getYear(currentDate), month, getDate(currentDate));
    setCurrentDate(newDate);
    setViewMode("day");
    setMonthSearch("");
  };

  const handleDaySelect = (day: number) => {
    const newDate = new Date(getYear(currentDate), getMonth(currentDate), day);
    setCurrentDate(newDate);
    onSelect(newDate);
    setDaySearch("");
  };

  useEffect(() => {
    if (selected && isValid(selected)) {
      setCurrentDate(selected);
    }
  }, [selected]);

  return (
    <div className="bg-white p-2 rounded-md border w-64">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setViewMode("year")}
          className="px-2 py-1 hover:bg-gray-100 rounded"
        >
          {format(currentDate, "yyyy", { locale: es })}
        </button>
        <button
          onClick={() => setViewMode("month")}
          className="px-2 py-1 hover:bg-gray-100 rounded"
        >
          {format(currentDate, "MMMM", { locale: es })}
        </button>
      </div>

      {/* Content */}
      {viewMode === "year" && (
        <div>
          <input
            type="text"
            placeholder="Buscar año..."
            value={yearSearch}
            onChange={(e) => setYearSearch(e.target.value)}
            className="w-full p-1 mb-2 border rounded text-sm"
          />
          <div className="grid grid-cols-3 gap-2 h-48 overflow-y-auto">
            {filteredYears.map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`p-1 text-sm rounded ${
                  getYear(currentDate) === year
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {viewMode === "month" && (
        <div>
          <input
            type="text"
            placeholder="Buscar mes..."
            value={monthSearch}
            onChange={(e) => setMonthSearch(e.target.value)}
            className="w-full p-1 mb-2 border rounded text-sm"
          />
          <div className="grid grid-cols-3 gap-2 h-48 overflow-y-auto">
            {filteredMonths.map((month) => (
              <button
                key={month.value}
                onClick={() => handleMonthSelect(month.value)}
                className={`p-1 text-sm rounded ${
                  getMonth(currentDate) === month.value
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {month.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {viewMode === "day" && (
        <div>
          <input
            type="text"
            placeholder="Buscar día..."
            value={daySearch}
            onChange={(e) => setDaySearch(e.target.value)}
            className="w-full p-1 mb-2 border rounded text-sm"
          />
          <div className="grid grid-cols-7 gap-1 h-48 overflow-y-auto">
            {filteredDays.map((day) => (
              <button
                key={day}
                onClick={() => handleDaySelect(day)}
                className={`p-1 text-sm rounded ${
                  getDate(currentDate) === day
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;