"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Client, Task, TaskStatus } from "@/lib/types";
import ClientList from "@/components/ClientList";
import TaskList from "@/components/TaskList";
import TaskFilters from "@/components/TaskFilters";
import AddTaskModal from "@/components/AddTaskModal";

export default function Home() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadClients() {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClients(data);
        if (data.length > 0) setSelectedClient(data[0]);
      } catch (err) {
        console.error("Failed to load clients", err);
      } finally {
        setClientsLoading(false);
      }
    }
    loadClients();
  }, []);

  const loadTasks = useCallback(async (clientId: string) => {
    setTasksLoading(true);
    try {
      const res = await fetch(`/api/tasks?client_id=${clientId}`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setTasksLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedClient) {
      loadTasks(selectedClient.id);
      setStatusFilter("");
      setCategoryFilter("");
      setSearchQuery("");
    }
  }, [selectedClient, loadTasks]);

  const handleStatusChange = useCallback(async (taskId: string, newStatus: TaskStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
        );
      }
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  }, []);

  const handleTaskAdded = useCallback((newTask: Task) => {
    setTasks((prev) => [...prev, newTask]);
    setShowAddModal(false);
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter && task.status !== statusFilter) return false;
      if (categoryFilter && task.category !== categoryFilter) return false;
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) return false;
      return true;
    });
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "Pending").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      completed: tasks.filter((t) => t.status === "Completed").length,
      overdue: tasks.filter(
        (t) => t.status !== "Completed" && new Date(t.due_date) < today
      ).length,
    };
  }, [tasks]);

  return (
    <div className="flex h-screen mesh-bg overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:relative z-30 md:z-auto h-full w-72 flex flex-col transition-transform duration-300 border-r
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          background: "linear-gradient(180deg, #080814 0%, #05050d 100%)",
          borderColor: "rgba(233,30,140,0.15)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b" style={{ borderColor: "rgba(233,30,140,0.12)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center animate-float"
              style={{
                background: "linear-gradient(135deg, #e91e8c, #c2185b)",
                boxShadow: "0 0 20px rgba(233,30,140,0.5)",
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-base gradient-text">LedgerComply</span>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Compliance Tracker</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-pink-400 hover:text-pink-300 transition-colors"
          >✕</button>
        </div>

        {/* Client count */}
        <div className="px-5 py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--pink-primary)" }}>
            Clients — {clients.length}
          </p>
        </div>

        {/* Client list */}
        <div className="flex-1 overflow-y-auto">
          <ClientList
            clients={clients}
            selectedClientId={selectedClient?.id ?? null}
            onSelect={(c) => { setSelectedClient(c); setSidebarOpen(false); }}
            loading={clientsLoading}
          />
        </div>

        {/* Bottom glow line */}
        <div
          className="h-px w-full"
          style={{ background: "linear-gradient(90deg, transparent, var(--pink-primary), transparent)" }}
        />
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header
          className="border-b px-4 md:px-6 py-4 flex items-center gap-3"
          style={{
            background: "rgba(8,8,20,0.9)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(233,30,140,0.12)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden transition-colors"
            style={{ color: "var(--pink-primary)" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            {selectedClient ? (
              <div className="animate-fade-in">
                <h1 className="font-bold text-lg leading-none truncate" style={{ color: "var(--text-primary)" }}>
                  {selectedClient.company_name}
                </h1>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {selectedClient.entity_type} · {selectedClient.country}
                </p>
              </div>
            ) : (
              <h1 className="font-bold text-lg" style={{ color: "var(--text-secondary)" }}>Select a client</h1>
            )}
          </div>

          {selectedClient && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-glow flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Task</span>
            </button>
          )}
        </header>

        {/* Stats bar */}
        {selectedClient && !tasksLoading && (
          <div
            className="border-b px-4 md:px-6 py-3 flex items-center gap-3 overflow-x-auto"
            style={{ background: "rgba(5,5,13,0.7)", borderColor: "rgba(233,30,140,0.08)" }}
          >
            <StatPill label="Total" value={stats.total} color="#a0a0c0" bg="rgba(255,255,255,0.05)" delay={0} />
            <StatPill label="Pending" value={stats.pending} color="#fbbf24" bg="rgba(251,191,36,0.08)" delay={1} />
            <StatPill label="In Progress" value={stats.inProgress} color="#60a5fa" bg="rgba(96,165,250,0.08)" delay={2} />
            <StatPill label="Completed" value={stats.completed} color="#34d399" bg="rgba(52,211,153,0.08)" delay={3} />
            {stats.overdue > 0 && (
              <StatPill label="Overdue" value={stats.overdue} color="#f43f5e" bg="rgba(244,63,94,0.12)" delay={4} />
            )}
          </div>
        )}

        {/* Filters */}
        {selectedClient && (
          <div
            className="px-4 md:px-6 py-3 border-b"
            style={{ background: "rgba(5,5,13,0.5)", borderColor: "rgba(255,255,255,0.04)" }}
          >
            <TaskFilters
              statusFilter={statusFilter}
              categoryFilter={categoryFilter}
              searchQuery={searchQuery}
              onStatusChange={setStatusFilter}
              onCategoryChange={setCategoryFilter}
              onSearchChange={setSearchQuery}
            />
          </div>
        )}

        {/* Task list */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-5">
          {!selectedClient && !clientsLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5 animate-float"
                style={{
                  background: "rgba(233,30,140,0.08)",
                  border: "1px solid rgba(233,30,140,0.2)",
                  boxShadow: "0 0 40px rgba(233,30,140,0.1)",
                }}
              >
                <svg className="w-10 h-10" style={{ color: "var(--pink-primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="font-semibold text-lg" style={{ color: "var(--text-secondary)" }}>Select a client</p>
              <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>Choose from the sidebar to view tasks</p>
            </div>
          ) : (
            <TaskList tasks={filteredTasks} loading={tasksLoading} onStatusChange={handleStatusChange} />
          )}
        </div>
      </main>

      {showAddModal && selectedClient && (
        <AddTaskModal
          clientId={selectedClient.id}
          onClose={() => setShowAddModal(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}
    </div>
  );
}

function StatPill({
  label, value, color, bg, delay,
}: {
  label: string; value: number; color: string; bg: string; delay: number;
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl whitespace-nowrap animate-count"
      style={{
        background: bg,
        border: `1px solid ${color}30`,
        animationDelay: `${delay * 80}ms`,
      }}
    >
      <span className="text-lg font-bold" style={{ color }}>{value}</span>
      <span className="text-xs font-medium" style={{ color: `${color}aa` }}>{label}</span>
    </div>
  );
}
