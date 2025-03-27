import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Search, Filter, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface TransactionFiltersProps {
  onFilterChange?: (filters: {
    search: string;
    dateRange: DateRange | undefined;
    type: string;
    status: string;
  }) => void;
}

const TransactionFilters = ({
  onFilterChange,
}: TransactionFiltersProps = {}) => {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [filtersVisible, setFiltersVisible] = useState(false);

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        search,
        dateRange,
        type,
        status,
      });
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDateRange({
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date(),
    });
    setType("all");
    setStatus("all");

    if (onFilterChange) {
      onFilterChange({
        search: "",
        dateRange: {
          from: new Date(new Date().setDate(new Date().getDate() - 30)),
          to: new Date(),
        },
        type: "all",
        status: "all",
      });
    }
  };

  return (
    <div className="w-full bg-black/30 backdrop-blur-md rounded-lg p-4 border border-gray-800 shadow-lg">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilterChange();
            }}
            className="pl-10 bg-black/50 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:items-center md:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersVisible(!filtersVisible)}
            className="bg-black/50 border-gray-700 text-gray-100 hover:bg-gray-800 hover:text-blue-400"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>

          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "bg-black/50 border-gray-700 text-gray-100 hover:bg-gray-800 hover:text-blue-400",
                    !dateRange && "text-gray-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM dd")} -{" "}
                        {format(dateRange.to, "MMM dd")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-gray-900 border-gray-700"
                align="end"
              >
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(range);
                    handleFilterChange();
                  }}
                  numberOfMonths={2}
                  className="bg-gray-900 text-gray-100"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {filtersVisible && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Transaction Type
            </label>
            <Select
              value={type}
              onValueChange={(value) => {
                setType(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="bg-black/50 border-gray-700 text-gray-100">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="send">Send</SelectItem>
                <SelectItem value="receive">Receive</SelectItem>
                <SelectItem value="swap">Swap</SelectItem>
                <SelectItem value="stake">Stake</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="bg-black/50 border-gray-700 text-gray-100">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700 text-gray-100">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className="bg-black/50 border-gray-700 text-gray-100 hover:bg-gray-800 hover:text-red-400"
            >
              <X className="mr-2 h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionFilters;
