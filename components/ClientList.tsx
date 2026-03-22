"use client";

import { Client } from "@/lib/types";

interface ClientListProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelect: (client: Client) => void;
  loading: boolean;
}

const ENTITY_COLORS: Record<string, string> = {
  "Private Limited": "bg-blue-100 text-blue-700",
  LLP: "bg-purple-100 text-purple-700",
  "Partnership Firm": "bg-amber-100 text-amber-700",
  "Sole Proprietorship": "bg-green-100 text-green-700",
};

export default function ClientList({
  clients,
  selectedClientId,
  onSelect,
  loading,
}: ClientListProps) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 rounded-lg bg-slate-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {clients.map((client) => {
        const isSelected = client.id === selectedClientId;
        const entityColor =
          ENTITY_COLORS[client.entity_type] ?? "bg-slate-100 text-slate-600";

        return (
          <button
            key={client.id}
            onClick={() => onSelect(client)}
            className={`w-full text-left rounded-lg p-3 border transition-all duration-150 ${
              isSelected
                ? "bg-indigo-600 border-indigo-600 text-white shadow-md"
                : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-sm text-slate-800"
            }`}
          >
            <p className={`font-semibold text-sm truncate ${isSelected ? "text-white" : "text-slate-800"}`}>
              {client.company_name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  isSelected ? "bg-white/20 text-white" : entityColor
                }`}
              >
                {client.entity_type}
              </span>
              <span className={`text-xs ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                {client.country}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
