"use client";

import { Task, TaskStatus } from "@/lib/types";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export default function TaskList({ tasks, loading, onStatusChange }: TaskListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-2xl skeleton" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float"
          style={{
            background: "rgba(233,30,140,0.06)",
            border: "1px solid rgba(233,30,140,0.15)",
          }}
        >
          <svg
            className="w-8 h-8"
            style={{ color: "var(--text-muted)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>No tasks found</p>
        <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Try adjusting filters or add a new task</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 relative">
      {tasks.map((task, idx) => (
        <div key={task.id} style={{ animationDelay: `${idx * 50}ms` }}>
          <TaskCard task={task} onStatusChange={onStatusChange} />
        </div>
      ))}
    </div>
  );
}
