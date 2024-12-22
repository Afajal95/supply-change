import React, { useState } from "react";

export interface DateRangePickerProps {
    onChange: (range: [string, string], weekends: string[]) => void; // Change this
    predefinedRanges: { label: string; range: [string, string] }[];
  }
  

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, predefinedRanges }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedRange, setSelectedRange] = useState<[string, string] | null>(null);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const isWeekend = (date: Date | null) => {
    const day = date?.getDay();
    return day === 0 || day === 6; 
  };

  const generateDates = () => {
    const dates: (Date | null)[] = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(currentYear, currentMonth, i));
    }
    return dates;
  };

  const handleDateClick = (date: Date) => {
    const normalizedDate = normalizeDate(date);
    if (isWeekend(normalizedDate)) return;

    if (!startDate || (startDate && endDate)) {
        setStartDate(normalizedDate);
      setEndDate(null);
      setSelectedRange(null);
    } else if (startDate && !endDate) {
        const normalizedStartDate = normalizeDate(startDate);
        const endDate = normalizedDate > normalizedStartDate ? normalizedDate : normalizedStartDate;
        setEndDate(endDate);
        const range: [string, string] = [
          formatDate(normalizedStartDate),
          formatDate(endDate),
        ];
      const weekendsInRange = getWeekendsInRange(startDate, date > startDate ? date : startDate);
      onChange(
        range,
        weekendsInRange
      );
      setSelectedRange(range);
    }
  };

  const getWeekendsInRange = (start: Date, end: Date) => {
    const weekends: string[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (isWeekend(d)) {
        weekends.push(formatDate(new Date(d)));
      }
    }
    return weekends;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const changeMonth = (increment: number) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const renderPredefinedRanges = () => {
    return (
      <div style={{ marginTop: "10px" }}>
        {predefinedRanges?.map((range) => (
          <button
            key={range.label}
            onClick={() => {
              const start = new Date(range.range[0]);
              const end = new Date(range.range[1]);
              setStartDate(start);
              setEndDate(end);
              onChange(range.range, getWeekendsInRange(start, end));
            }}
          >
            {range.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div>
        <button onClick={() => changeMonth(-1)}>{"<"}</button>
        <span>{`${currentMonth + 1} / ${currentYear}`}</span>
        <button onClick={() => changeMonth(1)}>{">"}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
        {weekdays.map((day) => (
          <div key={day} style={{ fontWeight: "bold" }}>
            {day}
          </div>
        ))}
        {generateDates().map((date, index) => (
          <div
            key={index}
            onClick={() => date && handleDateClick(date)}
            style={{
              padding: "10px",
              textAlign: "center",
              backgroundColor:
  date &&
  ((startDate &&
    date >= startDate &&
    (!endDate || date <= endDate)) &&
  !isWeekend(date)
    ? "lightblue"
    : isWeekend(date)
    ? "lightgray"
    : "white") || undefined,
              pointerEvents: isWeekend(date) ? "none" : "auto",
              color: isWeekend(date) ? "darkgray" : "black",
              cursor: date && !isWeekend(date) ? "pointer" : "default",
            }}
          >
            {date ? date.getDate() : ""}
          </div>
        ))}
      </div>
      {renderPredefinedRanges()}
      {selectedRange && (
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Range:</strong> {selectedRange[0]} to {selectedRange[1]}
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
