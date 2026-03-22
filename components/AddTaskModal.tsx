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
    if (!form.due_date)     { setError("Due date is required"); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, client_id: clientId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create task"); return; }
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
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: "rgba(5,5,13,0.8)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl animate-modal"
        style={{
          background: "linear-gradient(160deg, #0f0f22, #0a0a18)",
          border: "1px solid rgba(233,30,140,0.3)",
          boxShadow: "0 0 60px rgba(233,30,140,0.15), 0 25px 50px rgba(0,0,0,0.6)",
        }}
      >
        {/* Top glow line */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: "linear-gradient(90deg, transparent, var(--pink-primary), transparent)" }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: "rgba(233,30,140,0.12)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "rgba(233,30,140,0.12)",
                border: "1px solid rgba(233,30,140,0.25)",
              }}
            >
              <svg className="w-4 h-4" style={{ color: "var(--pink-primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>New Compliance Task</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ background: "rgba(255,255,255,0.04)", color: "var(--text-muted)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(233,30,140,0.15)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--pink-primary)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div
              className="text-sm px-4 py-2.5 rounded-xl"
              style={{
                background: "rgba(244,63,94,0.1)",
                color: "#fda4af",
                border: "1px solid rgba(244,63,94,0.25)",
              }}
            >
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
              className="input-dark w-full text-sm rounded-xl px-3 py-2.5"
              required
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              placeholder="Brief description..."
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="input-dark w-full text-sm rounded-xl px-3 py-2.5 resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Category *">
              <select name="category" value={form.category} onChange={handleChange} className="input-dark text-sm rounded-xl px-3 py-2.5">
                {TASK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Due Date *">
              <input
                name="due_date"
                type="date"
                value={form.due_date}
                onChange={handleChange}
                className="input-dark text-sm rounded-xl px-3 py-2.5"
                required
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Priority">
              <select name="priority" value={form.priority} onChange={handleChange} className="input-dark text-sm rounded-xl px-3 py-2.5">
                {TASK_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Initial Status">
              <select name="status" value={form.status} onChange={handleChange} className="input-dark text-sm rounded-xl px-3 py-2.5">
                {TASK_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-xl transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-glow px-5 py-2 text-sm font-bold text-white rounded-xl disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Adding...
                </span>
              ) : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--pink-soft)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
