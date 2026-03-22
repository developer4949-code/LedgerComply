"use client";

import { Client } from "@/lib/types";

interface ClientListProps {
  clients: Client[];
  selectedClientId: string | null;
  onSelect: (client: Client) => void;
  loading: boolean;
}

const ENTITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Private Limited": { bg: "rgba(96,165,250,0.1)", text: "#60a5fa", border: "rgba(96,165,250,0.3)" },
  "LLP":             { bg: "rgba(167,139,250,0.1)", text: "#a78bfa", border: "rgba(167,139,250,0.3)" },
  "Partnership Firm":{ bg: "rgba(251,191,36,0.1)",  text: "#fbbf24", border: "rgba(251,191,36,0.3)" },
  "Sole Proprietorship": { bg: "rgba(52,211,153,0.1)", text: "#34d399", border: "rgba(52,211,153,0.3)" },
};

const DEFAULT_COLOR = { bg: "rgba(233,30,140,0.1)", text: "#e91e8c", border: "rgba(233,30,140,0.3)" };

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
          <div key={i} className="h-16 rounded-xl skeleton" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      {clients.map((client, idx) => {
        const isSelected = client.id === selectedClientId;
        const ec = ENTITY_COLORS[client.entity_type] ?? DEFAULT_COLOR;

        return (
          <button
            key={client.id}
            onClick={() => onSelect(client)}
            className="w-full text-left rounded-xl p-3 transition-all duration-200 card-3d animate-slide-left group"
            style={{
              animationDelay: `${idx * 60}ms`,
              background: isSelected
                ? "linear-gradient(135deg, rgba(233,30,140,0.25), rgba(194,24,91,0.15))"
                : "rgba(255,255,255,0.03)",
              border: isSelected
                ? "1px solid rgba(233,30,140,0.6)"
                : "1px solid rgba(255,255,255,0.06)",
              boxShadow: isSelected
                ? "0 0 20px rgba(233,30,140,0.25), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "none",
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(233,30,140,0.07)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(233,30,140,0.25)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)";
              }
            }}
          >
            <div className="flex items-center gap-2">
              {/* Active indicator */}
              {isSelected && (
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "var(--pink-primary)", boxShadow: "0 0 6px var(--pink-primary)" }}
                />
              )}
              <p
                className="font-semibold text-sm truncate"
                style={{ color: isSelected ? "#fff" : "var(--text-primary)" }}
              >
                {client.company_name}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: isSelected ? "rgba(255,255,255,0.12)" : ec.bg,
                  color: isSelected ? "rgba(255,255,255,0.9)" : ec.text,
                  border: `1px solid ${isSelected ? "rgba(255,255,255,0.15)" : ec.border}`,
                }}
              >
                {client.entity_type}
              </span>
              <span className="text-xs" style={{ color: isSelected ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}>
                {client.country}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
