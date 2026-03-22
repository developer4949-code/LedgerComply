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

  // Fetch clients on mount
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

  // Fetch tasks when selected client changes
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
      ) {
        return false;
      }
      return true;
    });
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "Pending").length;
    const inProgress = tasks.filter((t) => t.status === "In Progress").length;
    const completed = tasks.filter((t) => t.status === "Completed").length;
    const overdue = tasks.filter(
      (t) => t.status !== "Completed" && new Date(t.due_date) < today
    ).length;
    return { total, pending, inProgress, completed, overdue };
  }, [tasks]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-30 md:z-auto h-full w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-base">LedgerComply</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Clients ({clients.length})
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <ClientList
            clients={clients}
            selectedClientId={selectedClient?.id ?? null}
            onSelect={(c) => {
              setSelectedClient(c);
              setSidebarOpen(false);
            }}
            loading={clientsLoading}
          />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-slate-500 hover:text-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            {selectedClient ? (
              <>
                <h1 className="font-bold text-slate-800 text-lg leading-none truncate">
                  {selectedClient.company_name}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedClient.entity_type} · {selectedClient.country}
                </p>
              </>
            ) : (
              <h1 className="font-bold text-slate-800 text-lg">Select a client</h1>
            )}
          </div>

          {selectedClient && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Task</span>
            </button>
          )}
        </header>

        {/* Stats bar */}
        {selectedClient && !tasksLoading && (
          <div className="bg-white border-b border-slate-100 px-4 md:px-6 py-3 flex items-center gap-4 overflow-x-auto">
            <StatPill label="Total" value={stats.total} color="text-slate-600 bg-slate-100" />
            <StatPill label="Pending" value={stats.pending} color="text-yellow-700 bg-yellow-50" />
            <StatPill label="In Progress" value={stats.inProgress} color="text-blue-700 bg-blue-50" />
            <StatPill label="Completed" value={stats.completed} color="text-green-700 bg-green-50" />
            {stats.overdue > 0 && (
              <StatPill label="Overdue" value={stats.overdue} color="text-red-700 bg-red-50" />
            )}
          </div>
        )}

        {/* Filters */}
        {selectedClient && (
          <div className="px-4 md:px-6 py-3 bg-slate-50 border-b border-slate-200">
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
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          {!selectedClient && !clientsLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-slate-600 font-medium">Select a client to view tasks</p>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              loading={tasksLoading}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>
      </main>

      {/* Add Task Modal */}
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
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${color}`}>
      <span className="text-base font-bold">{value}</span>
      <span className="font-medium opacity-75">{label}</span>
    </div>
  );
}
