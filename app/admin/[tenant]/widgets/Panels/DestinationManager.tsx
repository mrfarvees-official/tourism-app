"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";
import { FaArrowRight, FaChevronLeft, FaChevronRight, FaCirclePlus, FaMagnifyingGlass } from "react-icons/fa6";
import { X } from "lucide-react";
import { http } from "@/src/api/config/http";
import { useMedia, type MediaItem } from "@/src/api/hooks/media/useMedia";

type DestinationStatus = "active" | "draft" | "archived";

type DestinationRow = {
  id: number;
  slug: string;
  destinationName: string;
  description: string;
  region: string;
  province: string;
  district: string;
  bestTimeToVisit: string;
  nearbyAttractions: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  featured: boolean;
  status: DestinationStatus;
  updatedAt: string;
  createdAt: string;
};

type DestinationFormState = {
  slug: string;
  destinationName: string;
  description: string;
  region: string;
  province: string;
  district: string;
  bestTimeToVisit: string;
  nearbyAttractions: string;
  latitude: string;
  longitude: string;
  imageUrl: string;
  featured: boolean;
  status: DestinationStatus;
};

type Props = {
  tenant: string;
  title: string;
  description: string;
};

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25];
const DEFAULT_PAGE_SIZE = 10;

const emptyForm: DestinationFormState = {
  slug: "",
  destinationName: "",
  description: "",
  region: "",
  province: "",
  district: "",
  bestTimeToVisit: "",
  nearbyAttractions: "",
  latitude: "",
  longitude: "",
  imageUrl: "",
  featured: false,
  status: "draft",
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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
  return typeof value === "string" ? value : fallback;
}

function unwrapItems(payload: unknown): DestinationRow[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return [];
  const record = payload as Record<string, unknown>;
  const candidate = record.items ?? record.data ?? record.rows ?? record.results;
  if (!Array.isArray(candidate)) return [];

  return candidate.map((item) => {
    const row = item as Record<string, unknown>;
    const fields = row.fields && typeof row.fields === "object" && !Array.isArray(row.fields)
      ? (row.fields as Record<string, unknown>)
      : {};

    return {
      id: Number(row.id ?? 0),
      slug: getString(row.slug),
      destinationName: getString(row.destinationName, getString(row.title, "Destination")),
      description: getString(row.description),
      region: getString(row.region, getString(fields.region)),
      province: getString(row.province, getString(fields.province)),
      district: getString(row.district, getString(fields.district)),
      bestTimeToVisit: getString(row.bestTimeToVisit, getString(fields.bestTimeToVisit)),
      nearbyAttractions: getString(row.nearbyAttractions, getString(fields.nearbyAttractions)),
      latitude: getString(row.latitude, getString(fields.latitude)),
      longitude: getString(row.longitude, getString(fields.longitude)),
      imageUrl: getString(row.imageUrl, getString(row.image, "/no-image.jpg")),
      featured: Boolean(row.featured ?? fields.featured),
      status: (row.status as DestinationStatus) ?? "draft",
      updatedAt: getString(row.updatedAt, getString(row.updated_at)),
      createdAt: getString(row.createdAt, getString(row.created_at)),
    };
  });
}

function getMediaUrl(item: MediaItem) {
  return item.url ?? item.secure_url ?? "";
}

function getErrorMessage(error: unknown, fallback: string) {
  const typed = error as { response?: { data?: { message?: string; error?: string } }; message?: string };
  return typed?.response?.data?.message ?? typed?.response?.data?.error ?? typed?.message ?? fallback;
}

export default function DestinationManager({ tenant, title, description }: Props) {
  const [rows, setRows] = React.useState<DestinationRow[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = React.useState(0);
  const [notice, setNotice] = React.useState<Notice>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState<DestinationFormState>(emptyForm);
  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);
  const [mediaSearch, setMediaSearch] = React.useState("");
  const [selectedMediaUrl, setSelectedMediaUrl] = React.useState("");
  const { media, loading: mediaLoading, errors: mediaErrors, handleGetAllMedia } = useMedia();

  const loadRows = React.useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const response = await http.get("/api/admin/destinations", {
        params: { tenantKey: tenant, page, per_page: pageSize },
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
      setNotice({ tone: "error", message: getErrorMessage(error, "Failed to load destinations.") });
      setRows([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [tenant, page, pageSize]);

  React.useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const filteredRows = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => {
      const haystack = [
        row.destinationName,
        row.description,
        row.region,
        row.province,
        row.district,
        row.bestTimeToVisit,
        row.nearbyAttractions,
        row.status,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, rows]);

  const totalItems = totalCount || rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const pagedRows = React.useMemo(() => {
    return filteredRows;
  }, [filteredRows]);

  const pageNumbers = React.useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setNotice(null);
    setModalOpen(true);
  };

  const openEdit = (row: DestinationRow) => {
    setEditingId(row.id);
    setForm({
      slug: row.slug,
      destinationName: row.destinationName,
      description: row.description,
      region: row.region,
      province: row.province,
      district: row.district,
      bestTimeToVisit: row.bestTimeToVisit,
      nearbyAttractions: row.nearbyAttractions,
      latitude: row.latitude,
      longitude: row.longitude,
      imageUrl: row.imageUrl,
      featured: row.featured,
      status: row.status,
    });
    setNotice(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setMediaPickerOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      tenantKey: tenant,
      slug: form.slug.trim() || slugify(form.destinationName),
      destinationName: form.destinationName.trim(),
      description: form.description.trim(),
      region: form.region.trim(),
      province: form.province.trim(),
      district: form.district.trim(),
      bestTimeToVisit: form.bestTimeToVisit.trim(),
      nearbyAttractions: form.nearbyAttractions.trim(),
      latitude: form.latitude.trim(),
      longitude: form.longitude.trim(),
      imageUrl: form.imageUrl.trim(),
      featured: form.featured,
      status: form.status,
    };

    try {
      setNotice(null);
      if (editingId) {
        await http.patch(`/api/admin/destinations/${editingId}`, payload);
        setNotice({ tone: "success", message: "Destination updated." });
      } else {
        await http.post("/api/admin/destinations", payload);
        setNotice({ tone: "success", message: "Destination created." });
      }
      closeModal();
      await loadRows();
    } catch (error) {
      setNotice({ tone: "error", message: getErrorMessage(error, "Unable to save destination.") });
    }
  };

  const handleDelete = async (row: DestinationRow) => {
    if (!window.confirm(`Delete "${row.destinationName}"?`)) return;
    try {
      await http.delete(`/api/admin/destinations/${row.id}`, {
        params: { tenantKey: tenant },
      });
      setNotice({ tone: "success", message: "Destination deleted." });
      await loadRows();
    } catch (error) {
      setNotice({ tone: "error", message: getErrorMessage(error, "Unable to delete destination.") });
    }
  };

  const openMediaPicker = async () => {
    if (!tenant) return;
    setMediaPickerOpen(true);
    setMediaSearch("");
    setSelectedMediaUrl(form.imageUrl);
    try {
      await handleGetAllMedia(tenant);
    } catch {
      // hook already tracks the error state
    }
  };

  const commitMediaSelection = () => {
    const url = selectedMediaUrl.trim();
    if (!url) return;
    setForm((current) => ({ ...current, imageUrl: url }));
    setMediaPickerOpen(false);
  };

  const filteredMedia = React.useMemo(() => {
    const needle = mediaSearch.trim().toLowerCase();
    if (!needle) return media;
    return media.filter((item) => {
      const haystack = [item.label, item.url, item.secure_url, item.public_id, item.path]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [media, mediaSearch]);

  return (
    <div className="min-h-[calc(100vh-2px)] bg-white text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-muted">{tenant}</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-title">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{description}</p>
            </div>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-bg transition hover:opacity-90"
            >
              <FaCirclePlus />
              Add destination
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
                placeholder="Search destinations, regions, attractions..."
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <div className="flex items-center gap-3 text-sm text-muted">
              <span>
                {rows.length} on this page of {totalItems} destination{totalItems === 1 ? "" : "s"}
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
            <p
              className={`mt-4 text-sm font-medium ${
                notice.tone === "success" ? "text-success" : "text-rose-600"
              }`}
            >
              {notice.message}
            </p>
          ) : null}

          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-bg">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="border-b border-border bg-menu text-xs uppercase tracking-[0.18em] text-muted">
                <tr>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Tourism info</th>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-muted">
                      Loading destinations...
                    </td>
                  </tr>
                ) : pagedRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-muted">
                      No destinations found.
                    </td>
                  </tr>
                ) : (
                  pagedRows.map((row) => (
                    <tr key={row.id} className="border-b border-border last:border-b-0">
                      <td className="px-4 py-4 align-top">
                        <div className="font-semibold text-title">{row.destinationName}</div>
                        <div className="mt-1 text-xs text-muted">{row.slug}</div>
                        <p className="mt-2 max-w-lg text-xs leading-5 text-muted">{row.description}</p>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-muted">
                        <div>{row.region || "-"}</div>
                        <div>{[row.province, row.district].filter(Boolean).join(" • ") || "-"}</div>
                      </td>
                      <td className="px-4 py-4 align-top text-sm text-muted">
                        <div>{row.bestTimeToVisit || "-"}</div>
                        <div className="mt-1 max-w-sm">{row.nearbyAttractions || "-"}</div>
                        <div className="mt-1 text-xs">Lat {row.latitude || "-"}, Lng {row.longitude || "-"}</div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-3">
                          <div className="relative h-14 w-20 overflow-hidden rounded-xl border border-border bg-slate-100">
                            <img
                              src={row.imageUrl || "/no-image.jpg"}
                              alt={row.destinationName}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="max-w-[200px] truncate text-xs text-muted">{row.imageUrl || "-"}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                            {row.status}
                          </span>
                          {row.featured ? (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                              Featured
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-2 text-xs text-muted">{formatDate(row.updatedAt)}</div>
                      </td>
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
                <p className="text-sm font-semibold">{editingId ? "Edit destination" : "Create destination"}</p>
                <p className="text-xs text-muted">Use tourism-friendly fields and pick the cover image from media.</p>
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
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Destination name</span>
                  <input
                    value={form.destinationName}
                    onChange={(event) => {
                      const value = event.target.value;
                      setForm((current) => ({
                        ...current,
                        destinationName: value,
                        slug: current.slug ? current.slug : slugify(value),
                      }));
                    }}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="Sigiriya"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">URL slug</span>
                  <input
                    value={form.slug}
                    onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="sigiriya"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Region</span>
                  <input
                    value={form.region}
                    onChange={(event) => setForm((current) => ({ ...current, region: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="Central Province"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Province</span>
                  <input
                    value={form.province}
                    onChange={(event) => setForm((current) => ({ ...current, province: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="North Central"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">District</span>
                  <input
                    value={form.district}
                    onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="Matale"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Best time to visit</span>
                  <input
                    value={form.bestTimeToVisit}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, bestTimeToVisit: event.target.value }))
                    }
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="May to September"
                  />
                </label>
                <label className="grid gap-2 text-sm md:col-span-2">
                  <span className="font-medium">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    className="min-h-28 rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="Short tourism description"
                    required
                  />
                </label>
                <label className="grid gap-2 text-sm md:col-span-2">
                  <span className="font-medium">Nearby attractions</span>
                  <input
                    value={form.nearbyAttractions}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, nearbyAttractions: event.target.value }))
                    }
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="Rock fortress, village tours, viewpoints"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Latitude</span>
                  <input
                    value={form.latitude}
                    onChange={(event) => setForm((current) => ({ ...current, latitude: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="7.9570"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Longitude</span>
                  <input
                    value={form.longitude}
                    onChange={(event) => setForm((current) => ({ ...current, longitude: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="80.7603"
                  />
                </label>
                <label className="grid gap-2 text-sm md:col-span-2">
                  <span className="font-medium">Image URL</span>
                  <input
                    value={form.imageUrl}
                    onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="Select from media or paste a URL"
                  />
                </label>
                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={() => void openMediaPicker()}
                    className="inline-flex items-center gap-2 rounded-xl border border-dashed border-border bg-white px-4 py-3 text-sm font-semibold text-muted transition hover:bg-hover hover:text-fg"
                  >
                    <FaArrowRight />
                    Choose from media
                  </button>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                  />
                  Featured destination
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="font-medium">Status</span>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, status: event.target.value as DestinationStatus }))
                    }
                    className="rounded-xl border border-border bg-white px-4 py-3 outline-none focus:border-primary"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
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
                <button
                  type="submit"
                  className="rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-bg"
                >
                  {editingId ? "Save changes" : "Create destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {mediaPickerOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-6xl overflow-hidden rounded-3xl bg-bg shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Select media</p>
                <p className="text-xs text-muted">Pick an image URL from the tenant library.</p>
              </div>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-hover hover:text-fg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-4 p-5 lg:grid-cols-[280px_minmax(0,1fr)]">
              <div className="space-y-3">
                <input
                  value={mediaSearch}
                  onChange={(event) => setMediaSearch(event.target.value)}
                  placeholder="Search media"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-primary"
                />
                <div className="rounded-2xl border border-border bg-white p-4 text-sm text-muted">
                  <div className="flex justify-between gap-4">
                    <span>Selected</span>
                    <span className="truncate font-medium text-fg">{selectedMediaUrl || "-"}</span>
                  </div>
                  {mediaErrors?.length ? (
                    <p className="mt-3 text-rose-600">{mediaErrors[0]}</p>
                  ) : null}
                </div>
              </div>

              <div className="max-h-[65vh] overflow-auto rounded-2xl border border-border bg-white p-4">
                {mediaLoading && media.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-menu p-10 text-center text-sm text-muted">
                    Loading media...
                  </div>
                ) : filteredMedia.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-menu p-10 text-center text-sm text-muted">
                    No media found.
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredMedia.map((item) => {
                      const url = getMediaUrl(item);
                      const active = url === selectedMediaUrl;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedMediaUrl(url)}
                          className={`overflow-hidden rounded-2xl border text-left transition ${
                            active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="relative aspect-[4/3] bg-slate-100">
                            {url ? (
                              <img
                                src={url}
                                alt={item.label ?? `Media ${item.id}`}
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="space-y-1 p-3">
                            <p className="truncate text-sm font-semibold text-title">{item.label ?? `Media #${item.id}`}</p>
                            <p className="truncate text-xs text-muted">{url || "-"}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4">
              <button
                type="button"
                onClick={() => setMediaPickerOpen(false)}
                className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-fg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={commitMediaSelection}
                disabled={!selectedMediaUrl.trim()}
                className="rounded-xl bg-fg px-4 py-2.5 text-sm font-semibold text-bg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Use URL
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
