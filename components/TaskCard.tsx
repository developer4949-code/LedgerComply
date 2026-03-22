"use client";

import { Task, TaskStatus } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const STATUS_STYLES: Record<TaskStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
};

const PRIORITY_STYLES: Record<string, string> = {
  High: "text-red-600 font-semibold",
  Medium: "text-amber-600 font-medium",
  Low: "text-slate-500",
};

const PRIORITY_DOT: Record<string, string> = {
  High: "bg-red-500",
  Medium: "bg-amber-400",
  Low: "bg-slate-400",
};

function isOverdue(task: Task): boolean {
  if (task.status === "Completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.due_date);
  return due < today;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const overdue = isOverdue(task);
  const nextStatuses: Record<TaskStatus, TaskStatus[]> = {
    Pending: ["In Progress", "Completed"],
    "In Progress": ["Completed", "Pending"],
    Completed: ["Pending"],
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        overdue
          ? "border-red-300 bg-red-50 shadow-sm shadow-red-100"
          : "border-slate-200 bg-white hover:shadow-sm"
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-semibold text-sm ${
                overdue ? "text-red-800" : "text-slate-800"
              }`}
            >
              {task.title}
            </h3>
            {overdue && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                OVERDUE
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>

        {/* Status badge + dropdown */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_STYLES[task.status]}`}
          >
            {task.status}
          </span>
        </div>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 flex-wrap gap-2">
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
            {task.category}
          </span>
          <span className={`flex items-center gap-1 ${PRIORITY_STYLES[task.priority]}`}>
            <span className={`w-2 h-2 rounded-full ${PRIORITY_DOT[task.priority]}`} />
            {task.priority}
          </span>
          <span className={`${overdue ? "text-red-600 font-medium" : "text-slate-400"}`}>
            Due: {formatDate(task.due_date)}
          </span>
        </div>

        {/* Quick status change */}
        <div className="flex items-center gap-1">
          {nextStatuses[task.status].map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(task.id, s)}
              className="text-xs px-2 py-1 rounded-lg border border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-colors font-medium"
            >
              → {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
