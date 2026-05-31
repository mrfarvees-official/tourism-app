"use client";

import React from "react";
import { useSchema } from "@/src/api/hooks/content/useSchema";

type SchemaRow = {
  id: number;
  name?: string;
  menu?: string;
  version?: string;
  schema?: string | { columns?: Array<{ name?: string }> };
  resourcePolicy?: string | { version?: number; columnVisibility?: Record<string, boolean> };
};

function getTenantKeyFromPath(): string | null {
  if (typeof window === "undefined") return null;
  const parts = window.location.pathname.split("/").filter(Boolean);
  return parts[0] === "admin" ? (parts[1] ?? null) : null;
}

function parseSchemaColumns(schema: SchemaRow["schema"]): string[] {
  if (!schema) return [];
  try {
    const parsed = typeof schema === "string" ? JSON.parse(schema) : schema;
    const columns = Array.isArray(parsed?.columns) ? parsed.columns : [];
    return columns
      .map((c: { name: any; }) => (c && typeof c === "object" ? c.name : undefined))
      .filter((v: string): v is string => typeof v === "string" && !!v.trim());
  } catch {
    return [];
  }
}

function parsePolicy(
  policy: SchemaRow["resourcePolicy"],
): { version: number; columnVisibility: Record<string, boolean> } {
  try {
    const p = typeof policy === "string" ? JSON.parse(policy) : policy;
    return {
      version: typeof p?.version === "number" ? p.version : 1,
      columnVisibility:
        p && typeof p === "object" && p.columnVisibility && typeof p.columnVisibility === "object"
          ? (p.columnVisibility as Record<string, boolean>)
          : {},
    };
  } catch {
    return { version: 1, columnVisibility: {} };
  }
}

export default function ContentPanel() {
  const tenantKey = React.useMemo(getTenantKeyFromPath, []);
  const { schemas, loading, handleGetAllSchema, handleUpdateSchema } = useSchema();
  const [savingId, setSavingId] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!tenantKey) return;
    void handleGetAllSchema(tenantKey);
  }, [tenantKey, handleGetAllSchema]);

  const rows = React.useMemo(() => (Array.isArray(schemas) ? (schemas as SchemaRow[]) : []), [schemas]);

  const toggleColumn = async (row: SchemaRow, column: string) => {
    if (!tenantKey) return;
    const policy = parsePolicy(row.resourcePolicy);
    const nextVisibility = { ...policy.columnVisibility };
    nextVisibility[column] = !(nextVisibility[column] ?? true);

    const payload = {
      tenantKey,
      resourcePolicy: JSON.stringify({
        version: policy.version + 1,
        columnVisibility: nextVisibility,
      }),
    };

    try {
      setSavingId(row.id);
      await handleUpdateSchema(payload, row.id);
      await handleGetAllSchema(tenantKey);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="w-full min-h-screen p-5 bg-content text-fg">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Resource Management</h2>
        <p className="text-sm opacity-70">
          Manage schema versioning and column visibility. Hidden columns will be hidden in site runtime too.
        </p>
      </div>

      {!tenantKey && <p className="text-sm text-red-500">Tenant key not found.</p>}
      {loading && <p className="text-sm">Loading resources...</p>}

      <div className="space-y-4">
        {rows.map((row) => {
          const policy = parsePolicy(row.resourcePolicy);
          const columns = parseSchemaColumns(row.schema);
          return (
            <div key={row.id} className="rounded-lg border border-border bg-menu p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{row.name ?? `Resource #${row.id}`}</p>
                  <p className="text-xs opacity-70">Menu: {row.menu ?? "-"} | Version: {policy.version}</p>
                </div>
                <span className="text-xs">{savingId === row.id ? "Saving..." : "Ready"}</span>
              </div>

              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {columns.length === 0 ? (
                  <p className="text-sm opacity-70">No columns found in schema.</p>
                ) : (
                  columns.map((col) => {
                    const visible = policy.columnVisibility[col] ?? true;
                    return (
                      <label key={col} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={visible}
                          disabled={savingId === row.id}
                          onChange={() => {
                            void toggleColumn(row, col);
                          }}
                        />
                        <span>{col}</span>
                        <span className="text-xs opacity-70">({visible ? "visible" : "hidden"})</span>
                      </label>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

