"use client";

import React from "react";
import { FaEnvelopeOpenText, FaInbox, FaMessage, FaPhone, FaPaperPlane } from "react-icons/fa6";
import type { DashboardData } from "@/src/api/hooks/admin/useDashboard";
import { useContactSettings } from "@/src/api/hooks/settings/useContactSettings";
import { formatDate } from "./panelUtils";
import { buildMailtoHref, readLeadContact, type ContactLead } from "./contactLeadUtils";
import { buildCustomerIntakeLink } from "@/src/utils/customerPortal";
import { sendCustomerIntakeInvite } from "@/src/api/routes/settings/contact";

type Props = {
  tenant: string;
  dashboard: DashboardData | null;
};

export default function InboxPanel({ tenant, dashboard }: Props) {
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState<string | null>(null);
  const { settings } = useContactSettings(tenant);
  const inbox = (dashboard?.categories?.inbox ??
    dashboard?.categories?.contacts ??
    dashboard?.categories?.leads ??
    dashboard?.categories?.customer_messages ??
    []) as ContactLead[];

  const handleRequireCustomerData = React.useCallback(
    async (item: ContactLead) => {
      const lead = readLeadContact(item);
      if (!lead.email) return;

      setActionLoading(lead.email);
      setActionMessage(null);

      try {
        const response = await fetch("/api/customer-intakes/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
          }),
        });

        const payload = (await response.json().catch(() => null)) as
          | { data?: { token?: string } }
          | { error?: string }
          | null;

        if (!response.ok) {
          throw new Error((payload as { error?: string } | null)?.error ?? "Failed to create intake link.");
        }

        const responseData =
          payload && typeof payload === "object" && "data" in payload
            ? payload.data
            : null;
        const token = responseData?.token ?? "";
        if (!token) {
          throw new Error("The intake token was not returned.");
        }

        const intakeLink = buildCustomerIntakeLink(tenant, token);
        const mailResponse = await sendCustomerIntakeInvite(tenant, {
          token,
          intakeLink,
        });

        if (!mailResponse.data?.ok) {
          throw new Error(mailResponse.data?.message ?? "Failed to send customer intake email.");
        }

        setActionMessage(`Email sent to ${lead.email}.`);
      } catch (error) {
        setActionMessage(error instanceof Error ? error.message : "Failed to send customer intake email.");
      } finally {
        setActionLoading(null);
      }
    },
    [settings.payment_brand_name, settings.payment_currency, settings.payment_note, settings.payment_partial_amount, tenant],
  );

  return (
    <div className="min-h-[calc(100vh-2px)] bg-bg text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted">
            <FaInbox />
            {tenant}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Inbox</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Customer inquiries, lead captures, and form submissions collected from the tenant content store.
          </p>
        </div>

        <div className="mt-6 grid gap-3">
          {inbox.length === 0 ? (
            <div className="bg-menu px-6 py-10 shadow-sm">
              <p className="text-sm text-muted">No customer inquiries were detected from your current content sources.</p>
            </div>
          ) : (
            inbox.map((item, index) => {
              const lead = readLeadContact(item);
              const replyHref = buildMailtoHref(item, tenant);
              const title = item.title ?? lead.subject ?? lead.name ?? "Untitled request";
              const preview = item.preview ?? lead.message ?? "No preview available";

              return (
                <div key={`${String(title)}-${index}`} className="bg-menu px-6 py-5 shadow-sm">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 space-y-3">
                      <div>
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted">
                          <FaEnvelopeOpenText />
                          {lead.status || item.menu || "inbox"}
                        </div>
                        <p className="mt-2 text-lg font-semibold">{String(title)}</p>
                        <p className="mt-1 text-sm text-muted">{String(preview)}</p>
                      </div>

                      <div className="grid gap-2 text-sm text-muted sm:grid-cols-2">
                        <p>
                          <span className="font-medium text-fg">Name:</span> {lead.name || "Unknown"}
                        </p>
                        <p>
                          <span className="font-medium text-fg">Email:</span> {lead.email || "Not provided"}
                        </p>
                        <p>
                          <span className="font-medium text-fg">Phone:</span> {lead.phone || "Not provided"}
                        </p>
                        <p>
                          <span className="font-medium text-fg">Page:</span> {lead.pageSlug || item.menu || "Unknown"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-start gap-3 text-xs text-muted lg:items-end">
                      <p>{String(item.menu ?? "inbox")}</p>
                      <p>{formatDate(String(item.updated_at ?? item.created_at ?? ""))}</p>
                      <div className="flex flex-col gap-2">
                        {replyHref ? (
                          <a
                            href={replyHref}
                            className="inline-flex items-center gap-2 bg-fg px-4 py-2 text-sm font-semibold text-bg transition hover:opacity-90"
                          >
                            <FaPaperPlane />
                            Reply
                          </a>
                        ) : (
                          <span className="inline-flex items-center gap-2 bg-bg px-4 py-2 text-sm font-semibold text-muted">
                            <FaPhone />
                            Missing email
                          </span>
                        )}

                        {lead.email ? (
                          <button
                            type="button"
                            onClick={() => void handleRequireCustomerData(item)}
                            disabled={actionLoading === lead.email}
                            className="inline-flex items-center gap-2 bg-[#16232f] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <FaEnvelopeOpenText />
                            {actionLoading === lead.email ? "Preparing..." : "Require customer data"}
                          </button>
                        ) : null}
            </div>
            {actionMessage ? <p className="px-6 text-sm text-green-700">{actionMessage}</p> : null}
          </div>
        </div>
      </div>
              );
            })
          )}

          <div className="bg-bg px-6 py-5">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.25em] text-muted">
              <FaMessage />
              Workflow note
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              This view is intentionally focused on operational requests and lead-style entries rather than dashboard metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
