type MaybeRecord = Record<string, unknown>;

export type ContactLead = MaybeRecord & {
  title?: string;
  preview?: string;
  menu?: string;
  updated_at?: string;
  created_at?: string;
  status?: string;
  pageSlug?: string;
  page_slug?: string;
  source?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  customer?: MaybeRecord;
  contact?: MaybeRecord;
};

const asRecord = (value: unknown): MaybeRecord | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as MaybeRecord;
};

const toText = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
};

const firstText = (...values: unknown[]): string => {
  for (const value of values) {
    const text = toText(value);
    if (text) return text;
  }
  return "";
};

export function readLeadContact(lead: ContactLead) {
  const customer = asRecord(lead.customer) ?? asRecord(lead.contact) ?? null;

  return {
    name: firstText(customer?.name, lead.title, lead.subject),
    email: firstText(customer?.email, lead.email),
    phone: firstText(customer?.phone, lead.phone),
    subject: firstText(customer?.subject, lead.subject, lead.title),
    message: firstText(customer?.message, lead.message, lead.preview),
    pageSlug: firstText(lead.pageSlug, lead.page_slug, lead.menu),
    status: firstText(lead.status),
    source: firstText(lead.source),
    updatedAt: firstText(lead.updated_at, lead.created_at),
  };
}

export function buildMailtoHref(lead: ContactLead, tenant: string) {
  const contact = readLeadContact(lead);
  if (!contact.email) return null;

  const subject = encodeURIComponent(contact.subject || `Re: ${tenant} inquiry`);
  const bodyLines = [
    contact.name ? `Hi ${contact.name},` : "Hi,",
    "",
    "Thanks for reaching out.",
    "",
    contact.message ? `Your message: ${contact.message}` : null,
    contact.phone ? `Phone: ${contact.phone}` : null,
    contact.pageSlug ? `Source page: ${contact.pageSlug}` : null,
    "",
    "Best regards,",
    tenant,
  ].filter((line): line is string => line !== null);

  return `mailto:${encodeURIComponent(contact.email)}?subject=${subject}&body=${encodeURIComponent(
    bodyLines.join("\n"),
  )}`;
}

