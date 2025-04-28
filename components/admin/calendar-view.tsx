"use client";

import { useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

import type { Appointment } from "@/types/appointment";

type CalendarViewProps = {
  appointments: Appointment[];
  getStatusColor: (status: string) => string;
};

export function CalendarView({
  appointments,
  getStatusColor,
}: CalendarViewProps) {
  const [calendarView, setCalendarView] = useState<"day" | "week" | "month">(
    "day"
  );
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // Calendar navigation functions
  const navigatePrevious = () => {
    if (calendarView === "day") {
      setCurrentDate(subDays(currentDate, 1));
    } else if (calendarView === "week") {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (calendarView === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    }
  };

  const navigateNext = () => {
    if (calendarView === "day") {
      setCurrentDate(addDays(currentDate, 1));
    } else if (calendarView === "week") {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (calendarView === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  // Get appointments for the selected date
  const getAppointmentsForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return appointments.filter((a) => format(new Date(a.date), "yyyy-MM-dd") === dateString);
  };

  // Get appointments for the selected week
  const getAppointmentsForWeek = () => {
    const startDate = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

    return weekDays.map((day) => ({
      date: day,
      appointments: getAppointmentsForDate(day),
    }));
  };

  // Get appointments for the selected month
  const getAppointmentsForMonth = () => {
    const firstDayOfMonth = startOfMonth(currentDate);
    const firstDayOfCalendar = startOfWeek(firstDayOfMonth);

    // Generate 42 days (6 weeks) to ensure we cover the whole month view
    const calendarDays = Array.from({ length: 42 }, (_, i) =>
      addDays(firstDayOfCalendar, i)
    );

    return calendarDays.map((day) => ({
      date: day,
      appointments: getAppointmentsForDate(day),
      isCurrentMonth: isSameMonth(day, currentDate),
    }));
  };

  // Render time slots for day view
  const renderTimeSlots = () => {
    const timeSlots = [
      "9:00 AM",
      "9:30 AM",
      "10:00 AM",
      "10:30 AM",
      "11:00 AM",
      "11:30 AM",
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
      "2:30 PM",
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
      "5:00 PM",
      "5:30 PM",
    ];

    const appointmentsForDay = getAppointmentsForDate(currentDate);

    return (
      <div className="space-y-2">
        {timeSlots.map((timeSlot) => {
          const appointmentsAtTime = appointmentsForDay.filter(
            (a) => a.time === timeSlot
          );

          return (
            <div key={timeSlot} className="flex items-start gap-2 md:gap-4">
              <div className="w-16 md:w-20 text-xs md:text-sm text-stone-500 pt-2">
                {timeSlot}
              </div>
              <div className="flex-1 min-h-[60px] border-l-2 pl-2 md:pl-4">
                {appointmentsAtTime.length > 0 ? (
                  appointmentsAtTime.map((appointment) => (
                    <div
                      key={appointment.id}
                      className={`p-2 mb-2 rounded-md ${getStatusColor(
                        appointment.status
                      )} border border-${
                        appointment.status === "PENDING"
                          ? "yellow"
                          : appointment.status === "CONFIRMED"
                          ? "blue"
                          : appointment.status === "COMPLETED"
                          ? "green"
                          : "red"
                      }-200`}
                    >
                      <div className="font-medium text-sm md:text-base truncate">
                        {appointment.customerName}
                      </div>
                      <div className="text-xs md:text-sm truncate">
                        {appointment.service?.name} with {appointment.barber?.name}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full border-dashed border-2 border-stone-200 rounded-md p-2 text-stone-400 text-xs md:text-sm">
                    Available
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekData = getAppointmentsForWeek();
    const timeSlots = [
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "12:00 PM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
      "5:00 PM",
    ];

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[640px] md:min-w-[800px]">
          {/* Week header */}
          <div className="grid grid-cols-8 gap-1 md:gap-2 mb-2">
            <div className="text-stone-500"></div>
            {weekData.map((day, index) => (
              <div
                key={index}
                className={`text-center font-medium p-1 md:p-2 ${
                  isSameDay(day.date, new Date())
                    ? "bg-amber-100 rounded-md"
                    : ""
                }`}
              >
                <div className="text-xs md:text-sm">
                  {format(day.date, "EEE")}
                </div>
                <div
                  className={`text-sm md:text-lg ${
                    isSameDay(day.date, new Date()) ? "text-amber-600" : ""
                  }`}
                >
                  {format(day.date, "d")}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-8 gap-1 md:gap-2 mb-1">
              <div className="text-xs md:text-sm text-stone-500 pt-2">
                {time}
              </div>
              {weekData.map((day, dayIndex) => {
                const appointmentsAtTime = day.appointments.filter(
                  (a) =>
                    a.time === time || a.time === time.replace(":00", ":30")
                );

                return (
                  <div
                    key={dayIndex}
                    className={`min-h-[50px] md:min-h-[60px] border rounded-md p-1 ${
                      isSameDay(day.date, new Date())
                        ? "bg-amber-50"
                        : "bg-white"
                    }`}
                  >
                    {appointmentsAtTime.length > 0
                      ? appointmentsAtTime.map((appointment) => (
                          <div
                            key={appointment.id}
                            className={`p-1 mb-1 rounded-md text-xs ${getStatusColor(
                              appointment.status
                            )}`}
                            title={`${appointment.customerName} - ${appointment.service}`}
                          >
                            <div className="font-medium truncate">
                              {appointment.customerName}
                            </div>
                            <div className="truncate">{appointment.time}</div>
                          </div>
                        ))
                      : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render month view
  const renderMonthView = () => {
    const monthData = getAppointmentsForMonth();

    return (
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {/* Day headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-stone-500 p-1 md:p-2 text-xs md:text-sm"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {monthData.map((day, index) => (
          <div
            key={index}
            className={`min-h-[80px] md:min-h-[100px] border rounded-md p-1 md:p-2 ${
              isSameDay(day.date, new Date())
                ? "bg-amber-50 border-amber-200"
                : day.isCurrentMonth
                ? "bg-white"
                : "bg-stone-50 text-stone-400"
            }`}
          >
            <div className="text-right mb-1 text-xs md:text-sm">
              {format(day.date, "d")}
            </div>
            <div className="space-y-1">
              {day.appointments.slice(0, 3).map((appointment) => (
                <div
                  key={appointment.id}
                  className={`p-1 rounded-md text-xs ${getStatusColor(
                    appointment.status
                  )}`}
                  title={`${appointment.time} - ${appointment.customerName} - ${appointment.service}`}
                >
                  <div className="truncate text-[10px] md:text-xs">
                    {appointment.time}
                  </div>
                  <div className="truncate text-[10px] md:text-xs">
                    {appointment.customerName}
                  </div>
                </div>
              ))}
              {day.appointments.length > 3 && (
                <div className="text-[10px] md:text-xs text-stone-500 text-center">
                  +{day.appointments.length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle>Appointment Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={navigatePrevious}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToday}
              className="h-8 text-xs md:text-sm"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={navigateNext}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardDescription className="text-sm md:text-base">
            {calendarView === "day" && format(currentDate, "MMMM d, yyyy")}
            {calendarView === "week" &&
              `Week of ${format(startOfWeek(currentDate), "MMM d")} - ${format(
                addDays(startOfWeek(currentDate), 6),
                "MMM d, yyyy"
              )}`}
            {calendarView === "month" && format(currentDate, "MMMM yyyy")}
          </CardDescription>
          <div className="flex items-center gap-1 md:gap-2">
            <Button
              variant={calendarView === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalendarView("day")}
              className="h-8 text-xs md:text-sm"
            >
              Day
            </Button>
            <Button
              variant={calendarView === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalendarView("week")}
              className="h-8 text-xs md:text-sm"
            >
              Week
            </Button>
            <Button
              variant={calendarView === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setCalendarView("month")}
              className="h-8 text-xs md:text-sm"
            >
              Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-300px)] md:h-[600px]">
          <div className="mt-4 pr-4">
            {calendarView === "day" && renderTimeSlots()}
            {calendarView === "week" && renderWeekView()}
            {calendarView === "month" && renderMonthView()}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
