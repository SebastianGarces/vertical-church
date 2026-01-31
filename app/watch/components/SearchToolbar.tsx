"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FilterOptions } from "@/lib/db/queries";

interface SearchToolbarProps {
  filterOptions: FilterOptions;
  search: string;
  seriesId: string;
  book: string;
  pastor: string;
  year: string;
  onSearchChange: (value: string) => void;
  onSeriesChange: (value: string) => void;
  onBookChange: (value: string) => void;
  onPastorChange: (value: string) => void;
  onYearChange: (value: string) => void;
}

export function SearchToolbar({
  filterOptions,
  search,
  seriesId,
  book,
  pastor,
  year,
  onSearchChange,
  onSeriesChange,
  onBookChange,
  onPastorChange,
  onYearChange,
}: SearchToolbarProps) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-pipper p-2 md:flex-row md:items-center">
      {/* Search input - 1/3 width on desktop */}
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/50" />
        <Input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 border-0 bg-navy/10 pl-10 text-navy placeholder:text-navy/50 focus-visible:ring-0"
        />
      </div>

      {/* Filters - 2/3 width on desktop, equal width columns */}
      <div className="grid w-full grid-cols-2 gap-2 md:flex-[2] md:grid-cols-4">
        {/* Series filter */}
        <Select value={seriesId} onValueChange={onSeriesChange}>
          <SelectTrigger className="h-10 w-full border-0 bg-transparent text-navy hover:bg-navy/10 [&_svg]:!text-navy">
            <SelectValue placeholder="Series" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Series</SelectItem>
            {filterOptions.series.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Book filter */}
        <Select value={book} onValueChange={onBookChange}>
          <SelectTrigger className="h-10 w-full border-0 bg-transparent text-navy hover:bg-navy/10 [&_svg]:!text-navy">
            <SelectValue placeholder="Book" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Books</SelectItem>
            {filterOptions.books.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Pastor filter */}
        <Select value={pastor} onValueChange={onPastorChange}>
          <SelectTrigger className="h-10 w-full border-0 bg-transparent text-navy hover:bg-navy/10 [&_svg]:!text-navy">
            <SelectValue placeholder="Pastor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pastors</SelectItem>
            {filterOptions.pastors.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year filter */}
        <Select value={year} onValueChange={onYearChange}>
          <SelectTrigger className="h-10 w-full border-0 bg-transparent text-navy hover:bg-navy/10 [&_svg]:!text-navy">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {filterOptions.years.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
