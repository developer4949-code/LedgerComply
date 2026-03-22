"use client";

import { useState } from "react";
import { Task, TASK_CATEGORIES, TASK_PRIORITIES, TASK_STATUSES } from "@/lib/types";

interface AddTaskModalProps {
  clientId: string;
  onClose: () => void;
  onTaskAdded: (task: Task) => void;
}

export default function AddTaskModal({ clientId, onClose, onTaskAdded }: AddTaskModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: TASK_CATEGORIES[0],
    due_date: "",
    status: "Pending" as Task["status"],
    priority: "Medium" as Task["priority"],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) { setError("Title is required"); return; }
    if (!form.due_date) { setError("Due date is required"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, client_id: clientId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create task");
        return;
      }
      onTaskAdded(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Field label="Task Title *">
            <input
              name="title"
              type="text"
              placeholder="e.g. Q4 GST Filing"
              value={form.title}
              onChange={handleChange}
              className={inputCls}
              required
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              placeholder="Brief description of the task..."
              value={form.description}
              onChange={handleChange}
              rows={2}
              className={inputCls + " resize-none"}
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category *">
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                {TASK_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="Due Date *">
              <input
                name="due_date"
                type="date"
                value={form.due_date}
                onChange={handleChange}
                className={inputCls}
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Priority">
              <select name="priority" value={form.priority} onChange={handleChange} className={inputCls}>
                {TASK_PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>

            <Field label="Initial Status">
              <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                {TASK_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-lg transition-colors shadow-sm"
            >
              {submitting ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent text-slate-700";
