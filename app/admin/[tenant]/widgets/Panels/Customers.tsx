"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight, FaCirclePlus, FaMagnifyingGlass, FaUser } from "react-icons/fa6";
import { X } from "lucide-react";
import { http } from "@/src/api/config/http";

type LoyaltyTier = "Explorer" | "Insider" | "VIP";

type CustomerRow = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  preferredLanguage: string;
  loyaltyTier: LoyaltyTier;
  emergencyContact: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

type CustomerFormState = {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  preferredLanguage: string;
  loyaltyTier: LoyaltyTier;
  emergencyContact: string;
  address: string;
};

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

type Props = {
  tenant: string;
};

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25];
const DEFAULT_PAGE_SIZE = 10;

const emptyForm: CustomerFormState = {
  fullName: "",
  email: "",
  phone: "",
  nationality: "",
  passportNumber: "",
  preferredLanguage: "",
  loyaltyTier: "Explorer",
  emergencyContact: "",
  address: "",
};

function formatDate(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function unwrapItems(payload: unknown): CustomerRow[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const record = payload as Record<string, unknown>;
  const candidate = record.items ?? record.data ?? record.rows ?? record.results;
  if (!Array.isArray(candidate)) return [];

  return candidate.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      id: Number(row.id ?? 0),
      fullName: getString(row.full_name, getString(row.fullName, getString(row.name, "Customer"))),
      email: getString(row.email),
      phone: getString(row.phone),
      nationality: getString(row.nationality),
      passportNumber: getString(row.passport_number, getString(row.passportNumber)),
      preferredLanguage: getString(row.preferred_language, getString(row.preferredLanguage)),
      loyaltyTier: (getString(row.loyalty_tier, "Explorer") as LoyaltyTier) || "Explorer",
      emergencyContact: getString(row.emergency_contact, getString(row.emergencyContact)),
      address: getString(row.address),
      createdAt: getString(row.created_at, getString(row.createdAt)),
      updatedAt: getString(row.updated_at, getString(row.updatedAt)),
    };
  });
}

function getErrorMessage(error: unknown, fallback: string) {
  const typed = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return typed?.response?.data?.message ?? typed?.response?.data?.error ?? typed?.message ?? fallback;
}

export default function CustomersPanel({ tenant }: Props) {
  const [rows, setRows] = React.useState<CustomerRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = React.useState(0);
  const [notice, setNotice] = React.useState<Notice>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState<CustomerFormState>(emptyForm);

  const loadRows = React.useCallback(async () => {
    if (!tenant) return;
    setLoading(true);

    try {
      const response = await http.get("/api/admin/customers", {
        params: { tenantKey: tenant, page, per_page: pageSize, search: query.trim() || undefined },
      });
      const nextRows = unwrapItems(response.data?.data);
      const nextTotal = Number(response.data?.data?.meta?.total);
      const nextPage = Number(response.data?.data?.meta?.current_page);

      setRows(nextRows);
      setTotalCount(Number.isFinite(nextTotal) && nextTotal >= 0 ? nextTotal : nextRows.length);
      if (Number.isFinite(nextPage) && nextPage >= 1) {
        setPage(nextPage);
      }
    } catch (error) {
      setNotice({ tone: "error", message: getErrorMessage(error, "Failed to load customers.") });
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [tenant, page, pageSize, query]);

  React.useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const totalItems = totalCount || rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pageNumbers = React.useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setNotice(null);
    setModalOpen(true);
  };

  const openEdit = (row: CustomerRow) => {
    setEditingId(row.id);
    setForm({
      fullName: row.fullName,
      email: row.email,
      phone: row.phone,
      nationality: row.nationality,
      passportNumber: row.passportNumber,
      preferredLanguage: row.preferredLanguage,
      loyaltyTier: row.loyaltyTier,
      emergencyContact: row.emergencyContact,
      address: row.address,
    });
    setNotice(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      tenantKey: tenant,
      full_name: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      nationality: form.nationality.trim(),
      passport_number: form.passportNumber.trim(),
      preferred_language: form.preferredLanguage.trim(),
      loyalty_tier: form.loyaltyTier,
      emergency_contact: form.emergencyContact.trim(),
      address: form.address.trim(),
    };

    try {
      setNotice(null);
      if (editingId) {
        await http.patch(`/api/admin/customers/${editingId}`, payload);
        setNotice({ tone: "success", message: "Customer updated." });
      } else {
        await http.post("/api/admin/customers", payload);
        setNotice({ tone: "success", message: "Customer created." });
      }

      closeModal();
      await loadRows();
    } catch (error) {
      setNotice({ tone: "error", message: getErrorMessage(error, "Unable to save customer.") });
    }
  };

  const handleDelete = async (row: CustomerRow) => {
    if (!window.confirm(`Delete "${row.fullName}"?`)) return;

    try {
      await http.delete(`/api/admin/customers/${row.id}`, {
        params: { tenantKey: tenant },
      });
      setNotice({ tone: "success", message: "Customer deleted." });
      await loadRows();
    } catch (error) {
      setNotice({ tone: "error", message: getErrorMessage(error, "Unable to delete customer.") });
    }
  };

  return (
    <div className="min-h-[calc(100vh-2px)] bg-white text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted">{tenant}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-title">Customers</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                Manage customer profiles only. This table keeps contact and identity details separate from inquiries, team members, and other workspace data.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
            >
              <FaCirclePlus />
              Add customer
            </button>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex max-w-xl items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2.5">
              <FaMagnifyingGlass className="text-muted" />
              <input
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
                placeholder="Search customers, email, passport, loyalty..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <span>
                {rows.length} on this page of {totalItems} customer{totalItems === 1 ? "" : "s"}
              </span>
              <label className="flex items-center gap-2">
                <span className="whitespace-nowrap">Page size</span>
                <select
                  value={pageSize}
                  onChange={(event) => {
                    setPageSize(Number(event.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {notice ? (
            <p className={`mt-4 text-sm font-medium ${notice.tone === "success" ? "text-success" : "text-rose-600"}`}>
              {notice.message}
            </p>
          ) : null}

          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-bg">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-border bg-menu text-xs uppercase tracking-[0.18em] text-muted">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Profile</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-muted">
                      Loading customers...
                    </td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-muted">
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => (
                    <tr key={row.id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700">
                            <FaUser />
                          </div>
                          <div>
                            <div className="font-semibold text-title">{row.fullName}</div>
                            <div className="mt-1 text-xs text-muted">ID #{row.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-muted">
                        <div className="text-fg">{row.email || "-"}</div>
                        <div className="mt-1">{row.phone || "-"}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">{row.nationality || "-"}</div>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-muted">
                        <div>{row.passportNumber || "-"}</div>
                        <div>{row.preferredLanguage || "-"}</div>
                        <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                          {row.loyaltyTier}
                        </span>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-muted">
                        <div className="max-w-sm leading-6">{row.address || "-"}</div>
                        <div className="mt-1 text-xs">Emergency: {row.emergencyContact || "-"}</div>
                      </td>
                      <td className="px-4 py-4 align-top text-muted">{formatDate(row.updatedAt)}</td>
                      <td className="px-4 py-4 text-right align-top">
                        <div className="inline-flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="rounded-lg border border-border bg-bg px-3 py-2 text-xs font-semibold text-fg transition hover:bg-hover"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(row)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">
              Page {page} of {totalPages}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-fg disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronLeft />
                Prev
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-sm font-semibold text-fg disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <FaChevronRight />
              </button>
              <div className="flex flex-wrap items-center gap-2">
                {pageNumbers.map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={pageNumber === page ? "page" : undefined}
                    className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                      pageNumber === page
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-bg text-fg hover:border-primary/50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl overflow-hidden rounded-3xl bg-bg shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold">{editingId ? "Edit customer" : "Create customer"}</p>
                <p className="text-xs text-muted">Store only customer profile information in this table.</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-hover hover:text-fg"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-auto p-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm md:col-span-2">
                  <span className="font-medium">Full name</span>
                  <input
                    value={form.fullName}
                    onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="Ayesha Khan"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Email</span>
                  <input
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="ayesha@example.com"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Phone</span>
                  <input
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="+94 77 123 4567"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Nationality</span>
                  <input
                    value={form.nationality}
                    onChange={(event) => setForm((current) => ({ ...current, nationality: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="Sri Lankan"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Passport number</span>
                  <input
                    value={form.passportNumber}
                    onChange={(event) => setForm((current) => ({ ...current, passportNumber: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="N1234567"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Preferred language</span>
                  <input
                    value={form.preferredLanguage}
                    onChange={(event) => setForm((current) => ({ ...current, preferredLanguage: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="English"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Loyalty tier</span>
                  <select
                    value={form.loyaltyTier}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, loyaltyTier: event.target.value as LoyaltyTier }))
                    }
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                  >
                    <option value="Explorer">Explorer</option>
                    <option value="Insider">Insider</option>
                    <option value="VIP">VIP</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Emergency contact</span>
                  <input
                    value={form.emergencyContact}
                    onChange={(event) => setForm((current) => ({ ...current, emergencyContact: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="+94 77 765 4321"
                  />
                </label>
                <label className="grid gap-2 text-sm md:col-span-2">
                  <span className="font-medium">Address</span>
                  <textarea
                    value={form.address}
                    onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                    className="min-h-28 rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="45 Marine Drive, Colombo 03"
                  />
                </label>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-fg"
                >
                  Cancel
                </button>
                <button type="submit" className="rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-bg">
                  {editingId ? "Save changes" : "Create customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
