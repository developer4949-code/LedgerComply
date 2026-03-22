"use client";

import { Task, TaskStatus } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

const STATUS_CONFIG: Record<TaskStatus, { bg: string; text: string; border: string; dot: string }> = {
  Pending:     { bg: "rgba(251,191,36,0.1)",  text: "#fbbf24", border: "rgba(251,191,36,0.3)",  dot: "#fbbf24" },
  "In Progress":{ bg: "rgba(96,165,250,0.1)", text: "#60a5fa", border: "rgba(96,165,250,0.3)",  dot: "#60a5fa" },
  Completed:   { bg: "rgba(52,211,153,0.1)",  text: "#34d399", border: "rgba(52,211,153,0.3)",  dot: "#34d399" },
};

const PRIORITY_CONFIG: Record<string, { color: string; glow: string }> = {
  High:   { color: "#f43f5e", glow: "rgba(244,63,94,0.4)" },
  Medium: { color: "#fb923c", glow: "rgba(251,146,60,0.3)" },
  Low:    { color: "#94a3b8", glow: "transparent" },
};

function isOverdue(task: Task): boolean {
  if (task.status === "Completed") return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.due_date) < today;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const nextStatuses: Record<TaskStatus, TaskStatus[]> = {
  Pending:      ["In Progress", "Completed"],
  "In Progress": ["Completed", "Pending"],
  Completed:    ["Pending"],
};

export default function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const overdue = isOverdue(task);
  const sc = STATUS_CONFIG[task.status];
  const pc = PRIORITY_CONFIG[task.priority];

  return (
    <div
      className={`relative rounded-2xl p-4 transition-all duration-300 card-3d animate-slide-up ${
        overdue ? "animate-overdue" : ""
      }`}
      style={
        overdue
          ? {
              background: "linear-gradient(135deg, rgba(244,63,94,0.08), rgba(14,14,31,0.95))",
              border: "1px solid rgba(244,63,94,0.4)",
            }
          : {
              background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(14,14,31,0.8))",
              border: "1px solid rgba(255,255,255,0.07)",
            }
      }
    >
      {/* Priority bar at the top */}
      <div
        className="absolute top-0 left-4 right-4 h-px rounded-full opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${pc.color}, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-sm" style={{ color: overdue ? "#fda4af" : "var(--text-primary)" }}>
              {task.title}
            </h3>
            {overdue && (
              <span
                className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse"
                style={{
                  background: "rgba(244,63,94,0.15)",
                  color: "#f43f5e",
                  border: "1px solid rgba(244,63,94,0.4)",
                }}
              >
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                OVERDUE
              </span>
            )}
          </div>
          {task.description && (
            <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>
              {task.description}
            </p>
          )}
        </div>

        {/* Status badge */}
        <span
          className="text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 flex items-center gap-1.5"
          style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: sc.dot, boxShadow: `0 0 6px ${sc.dot}` }}
          />
          {task.status}
        </span>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between mt-3 pt-3 flex-wrap gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {/* Category */}
          <span
            className="px-2 py-0.5 rounded-lg font-medium"
            style={{
              background: "rgba(233,30,140,0.08)",
              color: "var(--pink-soft)",
              border: "1px solid rgba(233,30,140,0.2)",
            }}
          >
            {task.category}
          </span>

          {/* Priority */}
          <span className="flex items-center gap-1 font-semibold" style={{ color: pc.color }}>
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: pc.color, boxShadow: `0 0 6px ${pc.glow}` }}
            />
            {task.priority}
          </span>

          {/* Due date */}
          <span style={{ color: overdue ? "#f43f5e" : "var(--text-muted)" }}>
            {overdue ? "⚠ " : ""}Due: {formatDate(task.due_date)}
          </span>
        </div>

        {/* Status change buttons */}
        <div className="flex items-center gap-1.5">
          {nextStatuses[task.status].map((s) => (
            <button
              key={s}
              onClick={() => onStatusChange(task.id, s)}
              className="text-xs px-2.5 py-1 rounded-lg font-medium transition-all duration-150 hover:scale-105"
              style={{
                background: "rgba(233,30,140,0.08)",
                border: "1px solid rgba(233,30,140,0.25)",
                color: "var(--pink-secondary)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(233,30,140,0.2)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 12px rgba(233,30,140,0.3)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(233,30,140,0.08)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              → {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
