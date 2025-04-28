"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Check, Filter, Search, X } from "lucide-react";
import { updateAppointmentStatus } from "@/actions/appointment-actions";


import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { showSuccessToast, showErrorToast, showWarningToast } from "@/utils/toast-utils"

import type { Appointment, AppointmentStatus } from "@/types/appointment";

type AppointmentsTableProps = {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  getStatusColor: (status: string) => string;
};

export function AppointmentsTable({
  appointments,
  setAppointments,
  getStatusColor,
}: AppointmentsTableProps) {
  const [filteredAppointments, setFilteredAppointments] = 
    useState<Appointment[]>(appointments);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Apply filters whenever filter values or appointments change
  useEffect(() => {
    applyFilters();
  }, [statusFilter, dateFilter, searchQuery, appointments]);

  // Apply filters
  const applyFilters = () => {
    console.log("Applying filters with status:", statusFilter);
    console.log("Sample appointment status:", appointments[0]?.status);
    
    let filtered = [...appointments];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(
        (appointment) =>
          format(new Date(appointment.date), "yyyy-MM-dd") === dateFilter
      );
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (appointment) =>
          appointment.customerName.toLowerCase().includes(query) ||
          appointment.customerEmail.toLowerCase().includes(query) ||
          appointment.customerPhone?.includes(query)||
          appointment.service?.name.toLowerCase().includes(query) ||
          appointment.barber?.name.toLowerCase().includes(query)
      );
    }

    setFilteredAppointments(filtered);
  };

  // Update filters when inputs change - now remove setTimeout
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    // The useEffect will handle applying filters
  };

  const handleDateFilterChange = (date: Date | undefined) => {
    setDateFilter(date ? format(date, "yyyy-MM-dd") : "");
    // The useEffect will handle applying filters
  };

  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // The useEffect will handle applying filters
  };

  const clearFilters = () => {
    setDateFilter("");
    setStatusFilter("all");
    setSearchQuery("");
    // The useEffect will handle applying filters
  };
  // Update appointment status
  const updateStatus = async (
    id: number,
    status: "pending" | "confirmed" | "completed" | "cancelled"
  ) => {
    const response = await updateAppointmentStatus(id, status.toUpperCase() as AppointmentStatus);
  
    if (response.success && response.data) {
      const updated = response.data;
  
      // Update state
      const updatedAppointments = appointments.map((appointment) =>
        appointment.id === updated.id ? updated : appointment
      );
  
      setAppointments(updatedAppointments);
      setFilteredAppointments(updatedAppointments);
  
      showSuccessToast("Status Updated", `Appointment status updated to ${status}.`);
    } else {
      showErrorToast("Error", "Failed to update appointment status.");
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>All Appointments</CardTitle>
        <CardDescription>
          Manage and filter all appointment bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-stone-500" />
            <Input
              placeholder="Search by customer name, email or phone..."
              className="pl-8"
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
          </div>

          <div className="flex flex-wrap gap-2 md:gap-4">
            <div className="w-full sm:w-auto">
              <Select
                value={statusFilter}
                onValueChange={handleStatusFilterChange}
              >
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[180px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter
                      ? format(parseISO(dateFilter), "PPP")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFilter ? parseISO(dateFilter) : undefined}
                    onSelect={handleDateFilterChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              title="Clear filters"
              className="h-10 w-10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead className="w-[80px]">Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Service
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Barber</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[60px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="text-xs md:text-sm">
                      {format(new Date(appointment.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">
                      {appointment.time}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs md:text-sm font-medium">
                        {appointment.customerName}
                      </div>
                      <div className="text-xs text-stone-500 truncate max-w-[120px] md:max-w-none">
                        {appointment.customerEmail}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs md:text-sm">
                      {appointment.service?.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs md:text-sm">
                      {appointment.barber?.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Filter className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(appointment.id, "confirmed")
                            }
                          >
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Confirm
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(appointment.id, "completed")
                            }
                          >
                            <Check className="mr-2 h-4 w-4 text-blue-500" />
                            Mark as Completed
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              updateStatus(appointment.id, "cancelled")
                            }
                          >
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Cancel
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-stone-500">
            No appointments found matching your filters
          </div>
        )}
      </CardContent>
    </Card>
  );
}
