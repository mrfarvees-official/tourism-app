"use client";

import React from "react";
import { FaEnvelope, FaUserGroup } from "react-icons/fa6";
import type { DashboardData } from "@/src/api/hooks/admin/useDashboard";
import { formatDate } from "./panelUtils";
import { buildMailtoHref, readLeadContact, type ContactLead } from "./contactLeadUtils";

type Props = {
  tenant: string;
  dashboard: DashboardData | null;
};

type CustomerTableRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  travelers: number;
  visaType: string;
  partialPayment: string;
  currency: string;
  paymentStatus: string;
  updatedAt: string;
  source: string;
  paymentUrl?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asText(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function getSubmissionRows(records: Array<Record<string, unknown>>): CustomerTableRow[] {
  return records.map((record, index) => {
    const contact = asRecord(record.primaryContact) ?? asRecord(record.customer) ?? asRecord(record.contact) ?? {};
    const travelers = Array.isArray(record.travelers) ? record.travelers : Array.isArray(record.people) ? record.people : [];
    const firstTraveler = travelers.length > 0 ? asRecord(travelers[0]) ?? {} : {};

    return {
      id: asText(record.id) || asText(record.sessionId) || `row-${index}`,
      name:
        asText(contact.name) ||
        asText(record.customer_name) ||
        asText(record.customerName) ||
        asText(firstTraveler.full_name) ||
        "Unnamed customer",
      email:
        asText(contact.email) ||
        asText(record.customer_email) ||
        asText(record.customerEmail) ||
        "",
      phone:
        asText(contact.phone) ||
        asText(record.customer_phone) ||
        asText(record.customerPhone) ||
        "",
      travelers: travelers.length || (firstTraveler.full_name ? 1 : 0),
      visaType:
        asText(contact.visa_type) ||
        asText(record.visa_type) ||
        asText(record.visaType) ||
        asText(firstTraveler.visa_type) ||
        "N/A",
      partialPayment:
        asText(record.partialPaymentAmount) ||
        asText(record.partial_payment_amount) ||
        asText(record.payment_amount) ||
        "0",
      currency: asText(record.currency) || "USD",
      paymentStatus:
        asText(record.paymentStatus) ||
        asText(record.payment_status) ||
        "pending",
      updatedAt:
        asText(record.updatedAt) ||
        asText(record.updated_at) ||
        asText(record.createdAt) ||
        asText(record.created_at) ||
        "",
      source: asText(record.source) || asText(record.sessionId) || "customer intake",
      paymentUrl: asText(record.paymentUrl) || asText(record.payment_url) || undefined,
    };
  });
}

export default function CustomersPanel({ tenant, dashboard }: Props) {
  const [intakeRows, setIntakeRows] = React.useState<CustomerTableRow[]>([]);
  const [intakeLoading, setIntakeLoading] = React.useState(false);
  const members = dashboard?.members ?? [];
  const invites = dashboard?.invites ?? [];
  const inquiries = (dashboard?.categories?.inbox ??
    dashboard?.categories?.contacts ??
    dashboard?.categories?.leads ??
    dashboard?.categories?.customer_messages ??
    []) as ContactLead[];

  React.useEffect(() => {
    let cancelled = false;

    const loadIntakes = async () => {
      setIntakeLoading(true);

      try {
        const response = await fetch(`/api/customer-intakes?tenantKey=${encodeURIComponent(tenant)}`);
        const payload = (await response.json().catch(() => null)) as
          | { data?: Array<Record<string, unknown>> }
          | null;

        if (!cancelled) {
          setIntakeRows(getSubmissionRows(payload?.data ?? []));
        }
      } catch {
        if (!cancelled) {
          setIntakeRows([]);
        }
      } finally {
        if (!cancelled) {
          setIntakeLoading(false);
        }
      }
    };

    void loadIntakes();

    return () => {
      cancelled = true;
    };
  }, [tenant]);

  const customerRows = React.useMemo(() => {
    const dashboardRows = Array.isArray(dashboard?.records)
      ? getSubmissionRows(dashboard.records as Array<Record<string, unknown>>)
      : [];
    const merged = [...intakeRows, ...dashboardRows];
    const seen = new Set<string>();

    return merged.filter((row) => {
      if (seen.has(row.id)) return false;
      seen.add(row.id);
      return true;
    });
  }, [dashboard?.records, intakeRows]);

  return (
    <div className="min-h-[calc(100vh-2px)] bg-bg text-fg">
      <div className="mx-auto max-w-7xl p-6 lg:p-8">
        <div className="border-b border-border pb-6">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-muted">
            <FaUserGroup />
            {tenant}
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">
            Members, roles, and invite state for the tenant workspace.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.7fr]">
          <section className="bg-menu px-6 py-5 shadow-sm">
            <h2 className="text-lg font-semibold">Team members</h2>
            <div className="mt-4 space-y-3">
              {members.length === 0 ? (
                <p className="py-6 text-sm text-muted">No members were returned.</p>
              ) : (
                members.map((member, index) => (
                  <div key={`${String(member.email ?? "member")}-${index}`} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="font-medium">{String(member.name ?? "Unnamed member")}</p>
                    <p className="mt-1 text-sm text-muted">{String(member.email ?? "")}</p>
                    <p className="mt-1 text-xs text-muted">
                      {String(member.role ?? "")} • {String(member.status ?? "")} • {formatDate(String(member.last_seen_at ?? member.joined_at ?? ""))}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-bg px-6 py-5">
            <h2 className="text-lg font-semibold">Invites</h2>
            <div className="mt-4 space-y-3">
              {invites.length === 0 ? (
                <p className="text-sm text-muted">No invites are pending.</p>
              ) : (
                invites.map((invite, index) => (
                  <div key={`${String(invite.email ?? "invite")}-${index}`} className="border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <p className="font-medium">{String(invite.email ?? "Unknown email")}</p>
                    <p className="mt-1 text-xs text-muted">
                      {String(invite.role ?? "")} • {String(invite.status ?? "pending")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 bg-menu px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-semibold">Customer records</h2>
              <p className="mt-1 text-sm text-muted">
                All customer intake submissions appear here in a table layout for quick scanning and export-friendly review.
              </p>
            </div>
            <div className="text-xs uppercase tracking-[0.25em] text-muted">
              {intakeLoading ? "Loading" : `${customerRows.length} rows`}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-bg">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-menu text-[11px] uppercase tracking-[0.18em] text-muted">
                <tr>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Travelers</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {customerRows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-sm text-muted">
                      No customer intake submissions yet.
                    </td>
                  </tr>
                ) : (
                  customerRows.map((row) => (
                    <tr key={row.id} className="border-t border-border align-top">
                      <td className="px-4 py-4">
                        <div className="font-medium text-fg">{row.name}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] text-muted">
                          {row.source}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-fg">{row.email || "No email"}</div>
                        <div className="mt-1 text-xs text-muted">{row.phone || "No phone"}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-fg">{row.travelers}</div>
                        <div className="mt-1 text-xs text-muted">{row.visaType}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-fg">
                          {row.partialPayment} {row.currency}
                        </div>
                        <div className="mt-1 text-xs text-muted">Partial payment</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#36506a]">
                          {row.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-muted">{formatDate(row.updatedAt)}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          {row.email ? (
                            (() => {
                              const replyHref = buildMailtoHref(
                                {
                                  email: row.email,
                                  subject: `${tenant} visa intake`,
                                  message: `Following up on your ${tenant} intake submission.`,
                                  customer: { name: row.name, email: row.email, phone: row.phone },
                                },
                                tenant,
                              );

                              return replyHref ? (
                                <a
                                  href={replyHref}
                                  className="rounded-full border border-border bg-white px-3 py-2 text-xs font-semibold text-fg transition hover:bg-hover hover:text-hover_text"
                                >
                                  Email
                                </a>
                              ) : null;
                            })()
                          ) : null}
                          {row.paymentUrl ? (
                            <a
                              href={row.paymentUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-fg px-3 py-2 text-xs font-semibold text-bg transition hover:opacity-90"
                            >
                              Payment
                            </a>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 bg-menu px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
            <div>
              <h2 className="text-lg font-semibold">Recent inquiries</h2>
              <p className="mt-1 text-sm text-muted">
                Contact form submissions can be used to update customer records and reply by email.
              </p>
            </div>
            <FaEnvelope className="text-muted" />
          </div>

          <div className="mt-5 grid gap-3">
            {inquiries.length === 0 ? (
              <p className="text-sm text-muted">No customer inquiries were returned for this tenant.</p>
            ) : (
              inquiries.slice(0, 5).map((item, index) => {
                const lead = readLeadContact(item);
                const replyHref = buildMailtoHref(item, tenant);

                return (
                  <div key={`${String(lead.email || lead.subject || "inquiry")}-${index}`} className="bg-bg px-5 py-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-fg">{lead.name || lead.subject || "Customer inquiry"}</p>
                        <p className="mt-1 text-sm text-muted">{lead.email || "No email captured"}</p>
                        <p className="mt-2 text-sm text-muted">{lead.message || "No message preview available."}</p>
                        <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted">
                          {lead.pageSlug || item.menu || "unknown source"} • {formatDate(lead.updatedAt || item.updated_at || item.created_at || "")}
                        </p>
                      </div>

                      {replyHref ? (
                        <a
                          href={replyHref}
                          className="inline-flex shrink-0 items-center gap-2 bg-fg px-4 py-2 text-sm font-semibold text-bg transition hover:opacity-90"
                        >
                          Reply to customer
                        </a>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-2 bg-bg px-4 py-2 text-sm font-semibold text-muted">
                          Missing email
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
