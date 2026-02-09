import { id as localeId } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DayPicker, type ChevronProps } from "react-day-picker";
import "react-day-picker/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      animate
      mode="single"
      locale={localeId}
      weekStartsOn={1}
      showOutsideDays={showOutsideDays}
      components={{
        Chevron: ({ orientation }: ChevronProps) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
