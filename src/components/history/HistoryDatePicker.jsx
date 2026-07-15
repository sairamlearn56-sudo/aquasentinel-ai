import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import moment from "moment";

export default function HistoryDatePicker({ scanDates, onSelect, onClose }) {
  const [currentMonth, setCurrentMonth] = useState(moment());

  const startOfMonth = currentMonth.clone().startOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentMonth.daysInMonth();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(currentMonth.clone().date(d));
  }

  const hasScan = (date) => {
    if (!date) return false;
    return scanDates.has(date.format("YYYY-MM-DD"));
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className="absolute right-0 top-full mt-2 z-50 glass-strong rounded-2xl p-4 shadow-2xl border border-border w-80"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentMonth(currentMonth.clone().subtract(1, "month"))}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-sm">{currentMonth.format("MMMM YYYY")}</span>
          <button
            onClick={() => setCurrentMonth(currentMonth.clone().add(1, "month"))}
            className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, i) => (
            <button
              key={i}
              disabled={!date}
              onClick={() => date && onSelect(date.format("YYYY-MM-DD"))}
              className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                !date
                  ? "cursor-default"
                  : hasScan(date)
                  ? "bg-primary/20 text-primary hover:bg-primary/30 ring-1 ring-primary/30"
                  : "hover:bg-muted/50 text-foreground"
              }`}
            >
              {date?.date() || ""}
              {hasScan(date) && (
                <div className="w-1 h-1 rounded-full bg-primary mx-auto mt-0.5" />
              )}
            </button>
          ))}
        </div>

        {/* Legend + Close */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-primary/40" />
            Dates with scans
          </div>
          <button
            onClick={onClose}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Close
          </button>
        </div>
      </motion.div>
    </>
  );
}