"use client";

import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaEnvelopeOpenText,
  FaInbox,
  FaMessage,
  FaPaperPlane,
  FaPhone,
} from "react-icons/fa6";
import { useInbox } from "@/src/api/hooks/admin/useInbox";
import { useContactSettings } from "@/src/api/hooks/settings/useContactSettings";
import { formatDate } from "./panelUtils";
import {
  buildMailtoHref,
  readLeadContact,
  type ContactLead,
} from "./contactLeadUtils";
import {
  buildCustomerIntakeLink,
  createCustomerPortalSession,
  encodeCustomerPortalSession,
} from "@/src/utils/customerPortal";
import { sendCustomerIntakeInvite } from "@/src/api/routes/settings/contact";

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20, 25];
const DEFAULT_PAGE_SIZE = 5;

type Props = {
  tenant: string;
};

function getStatusStyle(status: string) {
  const normalized = status.toLowerCase();

  if (normalized === "replied") {
    return "bg-emerald-50 text-emerald-700";
  }

  if (normalized === "read") {
    return "bg-blue-50 text-blue-700";
  }

  if (normalized === "archived") {
    return "bg-slate-100 text-slate-500";
  }

  return "bg-amber-50 text-amber-700";
}

export default function InboxPanel({ tenant }: Props) {
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(DEFAULT_PAGE_SIZE);
  const [openActionId, setOpenActionId] = React.useState<
    string | number | null
  >(null);
  const { settings } = useContactSettings(tenant);
  const {
    inbox: apiInbox,
    loading,
    errors,
    refetch,
    saveInboxMessage,
    removeInboxMessage,
  } = useInbox(tenant);

  const inbox = React.useMemo(() => apiInbox as ContactLead[], [apiInbox]);

  const totalItems = inbox.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const pageNumbers = React.useMemo(
    () => Array.from({ length: totalPages }, (_, index) => index + 1),
    [totalPages],
  );
  const visibleInbox = React.useMemo(
    () => inbox.slice((page - 1) * pageSize, page * pageSize),
    [inbox, page, pageSize],
  );

  React.useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const handleRequireCustomerData = React.useCallback(
    async (item: ContactLead) => {
      const lead = readLeadContact(item);
      if (!lead.email) return;

      setActionLoading(lead.email);
      setActionMessage(null);

      try {
        const session = createCustomerPortalSession({
          tenantKey: tenant,
          customerName: lead.name,
          customerEmail: lead.email,
          customerPhone: lead.phone,
          partialPaymentAmount: settings.payment_partial_amount || "100",
          currency: settings.payment_currency || "LKR",
          brandName: settings.payment_brand_name || tenant,
          note: settings.payment_note || lead.message || lead.subject,
          prefill: {
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            subject: lead.subject,
            message: lead.message,
          },
        });
        const token = encodeCustomerPortalSession(session);
        if (!token) {
          throw new Error("The intake token was not returned.");
        }

        const intakeLink = buildCustomerIntakeLink(tenant, token);
        const mailResponse = await sendCustomerIntakeInvite(tenant, {
          token,
          intakeLink,
        });

        if (!mailResponse.data?.ok) {
          throw new Error(
            mailResponse.data?.message ??
              "Failed to send customer intake email.",
          );
        }

        setActionMessage(`Email sent to ${lead.email}.`);
      } catch (error) {
        setActionMessage(
          error instanceof Error
            ? error.message
            : "Failed to send customer intake email.",
        );
      } finally {
        setActionLoading(null);
      }
    },
    [
      settings.payment_brand_name,
      settings.payment_currency,
      settings.payment_note,
      settings.payment_partial_amount,
      tenant,
    ],
  );

  const handleUpdateStatus = React.useCallback(
    async (
      item: ContactLead,
      status: "new" | "read" | "replied" | "archived",
    ) => {
      const messageId = Number(item.id);
      if (!Number.isFinite(messageId)) return;

      try {
        setActionLoading(String(item.id));
        setActionMessage(null);
        await saveInboxMessage(messageId, { status });
        await refetch();
        setActionMessage(`Marked as ${status}.`);
      } catch (error) {
        setActionMessage(
          error instanceof Error
            ? error.message
            : "Failed to update inbox message.",
        );
      } finally {
        setActionLoading(null);
      }
    },
    [refetch, saveInboxMessage],
  );

  const handleDelete = React.useCallback(
    async (item: ContactLead) => {
      const messageId = Number(item.id);
      if (!Number.isFinite(messageId)) return;

      try {
        setActionLoading(String(item.id));
        setActionMessage(null);
        await removeInboxMessage(messageId);
        await refetch();
        setActionMessage("Inbox message deleted.");
      } catch (error) {
        setActionMessage(
          error instanceof Error
            ? error.message
            : "Failed to delete inbox message.",
        );
      } finally {
        setActionLoading(null);
      }
    },
    [refetch, removeInboxMessage],
  );

  const loadingState = loading && inbox.length === 0;
  const errorMessage = errors?.[0] ?? null;

  return (
    <div className="min-h-[calc(100vh-2px)] bg-white text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted">
            <FaInbox />
            {tenant}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Inbox</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Customer inquiries are now loaded from the dedicated inbox table,
            with the dashboard store kept as a fallback for legacy rows.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-md items-center gap-2 rounded-md border border-border bg-menu px-3 py-2">
            <FaInbox className="text-muted" />
            <span className="text-sm text-muted">Inbox page</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted">
            <span>
              {visibleInbox.length} on this page of {totalItems} item
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

        {errorMessage ? (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {errorMessage}
          </div>
        ) : null}

        <div className="mt-5 overflow-visible rounded-2xl border border-border bg-menu shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-bg text-[11px] uppercase tracking-[0.18em] text-muted">
              <tr>
                <th className="px-4 py-3">Inquiry</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                {/* <th className="px-4 py-3">Updated</th> */}
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingState ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-sm text-muted">
                    Loading inbox messages...
                  </td>
                </tr>
              ) : visibleInbox.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-sm text-muted">
                    No customer inquiries were detected from your current
                    sources.
                  </td>
                </tr>
              ) : (
                visibleInbox.map((item, index) => {
                  const lead = readLeadContact(item);
                  const replyHref = buildMailtoHref(item, tenant);
                  const title =
                    item.title ??
                    lead.subject ??
                    lead.name ??
                    "Untitled request";
                  const preview =
                    item.preview ?? lead.message ?? "No preview available";
                  const status = lead.status || item.status || "new";
                  const updatedAt = formatDate(
                    String(item.updated_at ?? item.created_at ?? ""),
                  );
                  const menuId = String(item.id ?? `${title}-${index}`);
                  const busy =
                    actionLoading === menuId || actionLoading === lead.email;
                  const markStatus = status === "read" ? "new" : "read";

                  return (
                    <tr
                      key={menuId}
                      className="border-t border-border align-top"
                    >
                      <td className="px-4 py-4">
                        <div className="max-w-[20rem]">
                          <p className="font-semibold text-fg">
                            {String(title)}
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            {String(preview)}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-fg">
                        {lead.name || "Unknown"}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {lead.email || "Not provided"}
                      </td>
                      <td className="px-4 py-4 text-muted">
                        {lead.phone || "Not provided"}
                      </td>
                      <td className="px-4 py-4 text-fg">
                        {lead.pageSlug || item.source || "Unknown"}
                      </td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] ${getStatusStyle(status)}`}>
                          <FaEnvelopeOpenText />
                          {status}
                        </div>
                      </td>
                      {/* <td className="px-4 py-4 text-muted">{updatedAt}</td> */}
                      <td className="relative z-50 px-4 py-4 overflow-visible">
                        <div className="relative z-50 flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenActionId(
                                openActionId === menuId ? null : menuId,
                              )
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900"
                            aria-label="Open actions"
                            title="Actions"
                          >
                            <span className="text-lg leading-none">...</span>
                          </button>

                          {openActionId === menuId ? (
                            <div className="absolute right-0 top-9 z-[99999] w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                              {replyHref ? (
                                <a
                                  href={replyHref}
                                  className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                                >
                                  <FaPaperPlane className="h-3.5 w-3.5" />
                                  Reply
                                </a>
                              ) : (
                                <div className="flex cursor-not-allowed items-center gap-2 px-3 py-2 text-sm text-slate-400">
                                  <FaPhone className="h-3.5 w-3.5" />
                                  No email
                                </div>
                              )}

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionId(null);
                                  void handleUpdateStatus(item, markStatus);
                                }}
                                disabled={busy}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
                              >
                                <FaEnvelopeOpenText className="h-3.5 w-3.5" />
                                {busy ? "Updating..." : `Mark as ${markStatus}`}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionId(null);
                                  void handleUpdateStatus(item, "archived");
                                }}
                                disabled={busy}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
                              >
                                <FaMessage className="h-3.5 w-3.5" />
                                Archive
                              </button>

                              {lead.email ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setOpenActionId(null);
                                    void handleRequireCustomerData(item);
                                  }}
                                  disabled={
                                    busy || actionLoading === lead.email
                                  }
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
                                >
                                  <FaEnvelopeOpenText className="h-3.5 w-3.5" />
                                  {actionLoading === lead.email
                                    ? "Preparing..."
                                    : "Request data"}
                                </button>
                              ) : null}

                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionId(null);
                                  void handleDelete(item);
                                }}
                                disabled={busy}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:text-red-300"
                              >
                                <FaPhone className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
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

        {actionMessage ? (
          <p className="mt-3 text-sm text-green-700">{actionMessage}</p>
        ) : null}

        <div className="bg-bg px-6 py-5">
          <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-muted">
            <FaMessage />
            Workflow note
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            This view is intentionally focused on operational requests and
            lead-style entries rather than dashboard metrics.
          </p>
        </div>
      </div>
    </div>
  );
}
