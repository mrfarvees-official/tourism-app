"use client";

import React from "react";
import { FaCirclePlus, FaMagnifyingGlass } from "react-icons/fa6";
import { moduleData, type TourismItem } from "@/src/shared/tourism/demoData";
import { http } from "@/src/api/config/http";
import DestinationManager from "./DestinationManager";

type ModuleKey = keyof typeof moduleData;

type Props = {
  tenant: string;
  moduleKey: ModuleKey;
  title: string;
  description: string;
};

function Status({ value }: { value: string }) {
  return (
    <span className="rounded-full bg-bg px-3 py-1 text-xs font-semibold capitalize text-muted">
      {value.replace(/_/g, " ")}
    </span>
  );
}

export default function BusinessModulePanel({ tenant, moduleKey, title, description }: Props) {
  const [query, setQuery] = React.useState("");
  const fallbackRows = moduleData[moduleKey] as TourismItem[];
  const [remoteRows, setRemoteRows] = React.useState<TourismItem[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const rows = remoteRows ?? fallbackRows;

  React.useEffect(() => {
    let active = true;
    const resource = moduleKey === "transport" ? "transport-options" : moduleKey;

    const load = async () => {
      setLoading(true);
      try {
        const response = await http.get(`/api/admin/${resource}`, {
          params: { tenantKey: tenant },
        });
        const payload = response.data?.data;
        if (active && Array.isArray(payload)) {
          setRemoteRows(payload as TourismItem[]);
        }
      } catch {
        if (active) {
          setRemoteRows(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [moduleKey, tenant]);
  const filtered = rows.filter((row) => {
    const haystack = `${row.title} ${row.subtitle} ${row.description}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  if (moduleKey === "destinations") {
    return <DestinationManager tenant={tenant} title={title} description={description} />;
  }

  return (
    <div className="min-h-[calc(100vh-2px)] bg-bg text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="border-b border-border pb-6">
          <div className="text-xs uppercase tracking-[0.35em] text-muted">{tenant}</div>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>
            </div>
            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 rounded-md bg-fg px-4 py-2 text-sm font-semibold text-bg"
            >
              <FaCirclePlus />
              {loading ? "Loading" : "Create"}
            </button>
          </div>
        </div>

        <div className="mt-5 flex max-w-md items-center gap-2 rounded-md border border-border bg-menu px-3 py-2">
          <FaMagnifyingGlass className="text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <section className="mt-5 overflow-hidden border border-border bg-menu">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-border bg-bg text-xs uppercase tracking-[0.18em] text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-b-0">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-fg">{row.title}</p>
                      <p className="mt-1 max-w-xl text-xs leading-5 text-muted">{row.description}</p>
                    </td>
                    <td className="px-4 py-4 text-muted">{row.subtitle}</td>
                    <td className="px-4 py-4"><Status value={row.status} /></td>
                    <td className="px-4 py-4 font-semibold">{row.amount ?? "-"}</td>
                    <td className="px-4 py-4 text-right">
                      <button type="button" className="rounded-md border border-border px-3 py-2 text-xs font-semibold">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
