"use client";

import { TASK_CATEGORIES, TASK_STATUSES, TaskStatus } from "@/lib/types";

interface TaskFiltersProps {
  statusFilter: string;
  categoryFilter: string;
  searchQuery: string;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
}

export default function TaskFilters({
  statusFilter,
  categoryFilter,
  searchQuery,
  onStatusChange,
  onCategoryChange,
  onSearchChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: "var(--pink-primary)" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-dark w-full pl-9 pr-3 py-2 text-sm rounded-xl"
        />
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="input-dark text-sm rounded-xl px-3 py-2"
      >
        <option value="">All Statuses</option>
        {TASK_STATUSES.map((s: TaskStatus) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Category filter */}
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="input-dark text-sm rounded-xl px-3 py-2"
      >
        <option value="">All Categories</option>
        {TASK_CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
}
