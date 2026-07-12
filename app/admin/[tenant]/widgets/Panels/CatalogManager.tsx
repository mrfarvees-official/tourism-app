"use client";

/* eslint-disable @next/next/no-img-element */

import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaCirclePlus,
  FaImage,
  FaMagnifyingGlass,
  FaTrash,
} from "react-icons/fa6";
import { X } from "lucide-react";
import type { TourismItem } from "@/src/shared/tourism/demoData";
import { useMedia, type MediaItem } from "@/src/api/hooks/media/useMedia";
import { http } from "@/src/api/config/http";

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "select"
  | "checkbox"
  | "asset";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  span?: 1 | 2;
  options?: Array<{ label: string; value: string }>;
};

export type ResourceConfig = {
  endpoint: string;
  singular: string;
  editable: boolean;
  fields: FieldConfig[];
  buildForm: (row: TourismItem) => Record<string, string | boolean>;
  buildPayload: (
    form: Record<string, string | boolean>,
  ) => Record<string, unknown>;
};

type Props = {
  tenant: string;
  title: string;
  description: string;
  config: ResourceConfig;
};

type Notice = {
  tone: "success" | "error";
  message: string;
} | null;

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25];
const DEFAULT_PAGE_SIZE = 10;

function getErrorMessage(error: unknown, fallback: string) {
  const typed = error as {
    response?: { data?: { message?: string; error?: string } };
    message?: string;
  };
  return (
    typed?.response?.data?.message ??
    typed?.response?.data?.error ??
    typed?.message ??
    fallback
  );
}

function unwrapItems(payload: unknown): {
  items: TourismItem[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  } | null;
} {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { items: [], meta: null };
  }

  const record = payload as Record<string, unknown>;
  const items = Array.isArray(record.items)
    ? (record.items as TourismItem[])
    : [];
  const metaRecord =
    record.meta &&
    typeof record.meta === "object" &&
    !Array.isArray(record.meta)
      ? (record.meta as Record<string, unknown>)
      : null;

  return {
    items,
    meta: metaRecord
      ? {
          current_page: Number(metaRecord.current_page ?? 1),
          per_page: Number(metaRecord.per_page ?? DEFAULT_PAGE_SIZE),
          total: Number(metaRecord.total ?? items.length),
          last_page: Number(metaRecord.last_page ?? 1),
        }
      : null,
  };
}

function createEmptyForm(fields: FieldConfig[]) {
  return fields.reduce<Record<string, string | boolean>>((acc, field) => {
    acc[field.name] = field.type === "checkbox" ? false : "";
    return acc;
  }, {});
}

function fieldValue(form: Record<string, string | boolean>, name: string) {
  const value = form[name];
  return typeof value === "boolean" ? value : (value ?? "");
}

function getRowImageUrl(row: TourismItem) {
  const record = row as Record<string, unknown>;
  const candidate =
    record.image_url ?? record.imageUrl ?? record.image ?? record.secure_url;
  return typeof candidate === "string" ? candidate : "";
}

function getMediaUrl(item: MediaItem) {
  return item.url ?? item.secure_url ?? "";
}

function FormField({
  field,
  value,
  onChange,
  onOpenMediaPicker,
}: {
  field: FieldConfig;
  value: string | boolean;
  onChange: (name: string, next: string | boolean) => void;
  onOpenMediaPicker?: (name: string, currentValue: string) => void;
}) {
  const common =
    "rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-950";

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(field.name, event.target.checked)}
          className="h-4 w-4"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "textarea") {
    return (
      <label
        className={`grid gap-2 text-sm font-medium ${field.span === 2 ? "lg:col-span-2" : ""}`}
      >
        {field.label}
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.placeholder}
          className={`${common} min-h-20`}
        />
      </label>
    );
  }

  if (field.type === "asset") {
    const currentValue = typeof value === "string" ? value : "";

    return (
      <label
        className={`grid gap-2 text-sm font-medium ${field.span === 2 ? "lg:col-span-2" : ""}`}
      >
        {field.label}
        <div className="grid gap-2">
          <input
            value={currentValue}
            onChange={(event) => onChange(field.name, event.target.value)}
            placeholder={field.placeholder}
            className={common}
          />
          <button
            type="button"
            onClick={() => onOpenMediaPicker?.(field.name, currentValue)}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <FaImage />
            Choose from media
          </button>
        </div>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <label
        className={`grid gap-2 text-sm font-medium ${field.span === 2 ? "lg:col-span-2" : ""}`}
      >
        {field.label}
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(field.name, event.target.value)}
          className={common}
        >
          {(field.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label
      className={`grid gap-2 text-sm font-medium ${field.span === 2 ? "lg:col-span-2" : ""}`}
    >
      {field.label}
      <input
        type={field.type}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(field.name, event.target.value)}
        placeholder={field.placeholder}
        className={common}
      />
    </label>
  );
}

function CatalogManager({ tenant, title, description, config }: Props) {
  const [rows, setRows] = React.useState<TourismItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [totalCount, setTotalCount] = React.useState(0);
  const [notice, setNotice] = React.useState<Notice>(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [form, setForm] = React.useState<Record<string, string | boolean>>(() =>
    createEmptyForm(config.fields),
  );
  const [brokenImages, setBrokenImages] = React.useState<
    Record<string, boolean>
  >({});
  const [mediaPickerOpen, setMediaPickerOpen] = React.useState(false);
  const [mediaPickerField, setMediaPickerField] = React.useState<string | null>(
    null,
  );
  const [mediaSearch, setMediaSearch] = React.useState("");
  const [selectedMediaUrl, setSelectedMediaUrl] = React.useState("");
  const {
    media,
    loading: mediaLoading,
    errors: mediaErrors,
    handleGetAllMedia,
  } = useMedia();

  const loadRows = React.useCallback(async () => {
    if (!tenant) return;
    setLoading(true);
    try {
      const response = await http.get(config.endpoint, {
        params: {
          tenantKey: tenant,
          page,
          per_page: pageSize,
          search: query.trim() || undefined,
        },
      });
      const payload = response.data?.data;
      const { items, meta } = unwrapItems(payload);
      setRows(items);
      setTotalCount(meta?.total ?? items.length);
      if (meta?.current_page) {
        setPage(meta.current_page);
      }
    } catch (error) {
      setRows([]);
      setTotalCount(0);
      setNotice({
        tone: "error",
        message: getErrorMessage(
          error,
          `Failed to load ${title.toLowerCase()}.`,
        ),
      });
    } finally {
      setLoading(false);
    }
  }, [config.endpoint, page, pageSize, query, tenant, title]);

  React.useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const totalItems = totalCount || rows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageNumbers = React.useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(createEmptyForm(config.fields));
    setNotice(null);
    setModalOpen(true);
  };

  const openEdit = (row: TourismItem) => {
    setEditingId(Number((row as Record<string, unknown>).id ?? 0));
    setForm(config.buildForm(row));
    setNotice(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setMediaPickerOpen(false);
    setMediaPickerField(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      setNotice(null);
      const payload = {
        tenantKey: tenant,
        ...config.buildPayload(form),
      };

      if (editingId) {
        await http.patch(`${config.endpoint}/${editingId}`, payload);
        setNotice({ tone: "success", message: `${config.singular} updated.` });
      } else {
        await http.post(config.endpoint, payload);
        setNotice({ tone: "success", message: `${config.singular} created.` });
      }

      closeModal();
      await loadRows();
    } catch (error) {
      setNotice({
        tone: "error",
        message: getErrorMessage(error, `Failed to save ${config.singular}.`),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: TourismItem) => {
    const id = Number((row as Record<string, unknown>).id ?? 0);
    if (!id) return;

    if (!window.confirm(`Delete "${row.title}"?`)) return;

    try {
      setNotice(null);
      await http.delete(`${config.endpoint}/${id}`, {
        params: { tenantKey: tenant },
      });
      setNotice({ tone: "success", message: `${config.singular} deleted.` });
      await loadRows();
    } catch (error) {
      setNotice({
        tone: "error",
        message: getErrorMessage(error, `Failed to delete ${config.singular}.`),
      });
    }
  };

  const openMediaPicker = async (fieldName: string, currentValue: string) => {
    if (!tenant) return;

    setMediaPickerField(fieldName);
    setSelectedMediaUrl(currentValue);
    setMediaSearch("");
    setMediaPickerOpen(true);

    try {
      await handleGetAllMedia(tenant);
    } catch {
      // media hook exposes its own error state
    }
  };

  const closeMediaPicker = () => {
    setMediaPickerOpen(false);
    setMediaPickerField(null);
  };

  const commitMediaSelection = () => {
    if (!mediaPickerField) return;

    const url = selectedMediaUrl.trim();
    if (!url) return;

    setForm((current) => ({ ...current, [mediaPickerField]: url }));
    closeMediaPicker();
  };

  const filteredMedia = React.useMemo(() => {
    const needle = mediaSearch.trim().toLowerCase();
    if (!needle) return media;

    return media.filter((item) => {
      const haystack = [
        item.label,
        item.url,
        item.secure_url,
        item.public_id,
        item.path,
      ]
        .filter((value): value is string => Boolean(value))
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [media, mediaSearch]);

  const isImageBroken = (key: string) => Boolean(brokenImages[key]);

  return (
    <div className="min-h-[calc(100vh-2px)] bg-white text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="border-b border-border pb-6">
          <div className="text-xs uppercase tracking-[0.35em] text-muted">
            {tenant}
          </div>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                {description}
              </p>
              {notice ? (
                <p
                  className={`mt-3 text-sm ${notice.tone === "success" ? "text-emerald-600" : "text-red-500"}`}
                >
                  {notice.message}
                </p>
              ) : null}
            </div>
            {config.editable ? (
              <button
                type="button"
                onClick={openCreate}
                className="inline-flex w-fit items-center gap-2 rounded-md bg-fg px-4 py-2 text-sm font-semibold text-bg"
              >
                <FaCirclePlus />
                {loading ? "Loading" : "Create"}
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-md items-center gap-2 rounded-md border border-border bg-menu px-3 py-2">
            <FaMagnifyingGlass className="text-muted" />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>
              {rows.length} on this page of {totalItems} item
              {totalItems === 1 ? "" : "s"}
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

        <section className="mt-5 overflow-hidden border border-border bg-menu">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-border bg-bg text-xs uppercase tracking-[0.18em] text-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Type</th>
                {config.singular !== "booking" ? (
                  <th className="px-4 py-3">Image</th>
                ) : null}
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                {config.editable ? (
                  <th className="px-4 py-3 text-right">Action</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={config.editable ? 6 : 5}
                    className="px-4 py-8 text-muted"
                  >
                    Loading {title.toLowerCase()}...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={config.editable ? 6 : 5}
                    className="px-4 py-8 text-muted"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-b-0"
                  >
                    <td className="px-4 py-4">
                      <p className="font-semibold text-fg">{row.title}</p>
                      <p className="mt-1 max-w-xl text-xs leading-5 text-muted">
                        {row.description}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-muted">{row.subtitle}</td>
                    {config.singular !== "booking" ? (
                      <td className="px-4 py-4">
                        {(() => {
                          const imageUrl = getRowImageUrl(row);
                          const imageKey = `${row.id}-${imageUrl || "empty"}`;
                          const broken = imageUrl
                            ? isImageBroken(imageKey)
                            : false;

                          if (!imageUrl) {
                            return (
                              <div className="flex h-16 w-24 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                No image
                              </div>
                            );
                          }

                          if (broken) {
                            return (
                              <div className="flex h-16 w-24 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-600">
                                Broken
                              </div>
                            );
                          }

                          return (
                            <div className="relative h-16 w-24 overflow-hidden rounded-xl border border-border bg-slate-100">
                              <img
                                src={imageUrl}
                                alt={row.title}
                                className="h-full w-full object-cover"
                                onError={() =>
                                  setBrokenImages((current) => ({
                                    ...current,
                                    [imageKey]: true,
                                  }))
                                }
                              />
                            </div>
                          );
                        })()}
                      </td>
                    ) : null}
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-bg px-3 py-1 text-xs font-semibold capitalize text-muted">
                        {row.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-semibold">
                      {row.amount ?? "-"}
                    </td>
                    {config.editable ? (
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="rounded-md border border-border px-3 py-2 text-xs font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDelete(row)}
                            className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                          >
                            <FaTrash />
                            Delete
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

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
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
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

      {config.editable && modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-3 sm:items-center sm:p-4">
          <div className="flex w-full max-w-4xl max-h-[85vh] flex-col overflow-hidden rounded-3xl bg-bg shadow-2xl">
            <div className="flex-none flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">
                  {title}
                </p>
                <h2 className="mt-1 text-xl font-semibold">
                  {editingId ? "Edit item" : "Create item"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full border border-border px-3 py-2 text-sm"
              >
                Close
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="grid gap-3 overflow-auto px-5 py-4 lg:grid-cols-2">
                {config.fields.map((field) => (
                  <FormField
                    key={field.name}
                    field={field}
                    value={fieldValue(form, field.name)}
                    onChange={(name, next) =>
                      setForm((current) => ({ ...current, [name]: next }))
                    }
                    onOpenMediaPicker={openMediaPicker}
                  />
                ))}
              </div>
              <div className="flex-none border-t border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update item"
                        : "Create item"}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                </div>
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
                <p className="text-xs text-muted">
                  Pick an image URL from the tenant library.
                </p>
              </div>
              <button
                type="button"
                onClick={closeMediaPicker}
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
                    <span className="truncate font-medium text-fg">
                      {selectedMediaUrl || "-"}
                    </span>
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
                            active
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-border hover:border-primary/50"
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
                            <p className="truncate text-sm font-semibold text-title">
                              {item.label ?? `Media #${item.id}`}
                            </p>
                            <p className="truncate text-xs text-muted">
                              {url || "-"}
                            </p>
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
                onClick={closeMediaPicker}
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

export default CatalogManager;
