"use client";

import Link from "next/link";
import { ReactNode } from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  meta?: string;
};

type DestinationFieldMap = Record<string, unknown>;

type DestinationFieldDefinition = {
  name: string;
  label?: string;
  type?: string;
  visible?: boolean;
  required?: boolean;
};

type DestinationCardProps = CardProps & {
  image?: string;
  imageAlt?: string;
  fields?: DestinationFieldMap;
  allowedFields?: DestinationFieldDefinition[];
  allowed_fields?: DestinationFieldDefinition[];
};

type BadgeProps = {
  value: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

type PriceBreakdownProps = {
  subtotal?: string | number;
  addonTotal?: string | number;
  discountTotal?: string | number;
  taxTotal?: string | number;
  total?: string | number;
};

type SimpleFormProps = {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
};

const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "bg-slate-100 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-800",
  danger: "bg-rose-100 text-rose-700",
  info: "bg-sky-100 text-sky-700",
};

function Card({ title, subtitle, description, href, meta }: CardProps) {
  const content = (
    <article className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-title">{title}</h3>
          {subtitle ? <p className="mt-1 text-sm font-medium text-primary">{subtitle}</p> : null}
        </div>
        {meta ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {meta}
          </span>
        ) : null}
      </div>
      {description ? <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p> : null}
    </article>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

function humanizeField(value: string) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatFieldValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value)) return value.map((item) => formatFieldValue(item)).join(", ");
  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "—";
    }
  }

  return String(value);
}

export function DestinationCard({
  title,
  subtitle,
  description,
  href,
  meta,
  image,
  imageAlt,
  fields,
  allowedFields,
  allowed_fields,
}: DestinationCardProps) {
  const knownKeys = new Set([
    "id",
    "slug",
    "title",
    "subtitle",
    "description",
    "status",
    "amount",
    "meta",
    "href",
    "image",
    "imageAlt",
    "fields",
    "allowedFields",
    "allowed_fields",
    "schema_blueprint",
    "updated_at",
  ]);

  const orderedFields = allowedFields?.length
    ? allowedFields
        .filter((field) => field.visible !== false)
        .map((field) => ({
          key: field.name,
          label: field.label ?? humanizeField(field.name),
          type: field.type,
          value: fields?.[field.name],
        }))
    : (allowed_fields?.length
        ? allowed_fields
            .filter((field) => field.visible !== false)
            .map((field) => ({
              key: field.name,
              label: field.label ?? humanizeField(field.name),
              type: field.type,
              value: fields?.[field.name],
            }))
        : Object.entries(fields ?? {})
            .filter(([key]) => !knownKeys.has(key))
            .map(([key, value]) => ({
              key,
              label: humanizeField(key),
              value,
            })));

  const content = (
    <article className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative aspect-[16/10] w-full bg-slate-100">
        <img
          src={image ?? "/no-image.jpg"}
          alt={imageAlt ?? title}
          className="h-full w-full object-cover"
        />
        {meta ? (
          <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {meta}
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-title">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm font-medium text-primary">{subtitle}</p> : null}
          </div>
        </div>

        {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}

        {orderedFields.length ? (
          <dl className="grid gap-3 sm:grid-cols-2">
            {orderedFields.map((field) => (
              <div key={field.key} className="rounded-2xl border border-border bg-slate-50 px-3 py-2">
                <dt className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  {field.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-title">
                  {formatFieldValue(field.value)}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </article>
  );

  if (!href) {
    return content;
  }

  return <Link href={href}>{content}</Link>;
}

export const PackageCard = Card;
export const ServiceCard = Card;
export const ActivityCard = Card;

export function BookingStatusBadge({ value, tone = "neutral" }: BadgeProps) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>{value}</span>;
}

export function PaymentStatusBadge({ value, tone = "neutral" }: BadgeProps) {
  return <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}>{value}</span>;
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-border bg-white p-8 text-center">
      <h3 className="text-xl font-semibold text-title">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-8 text-sm text-slate-600">
      {label}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-rose-200 bg-rose-50 p-8">
      <h3 className="text-lg font-semibold text-rose-900">{title}</h3>
      {description ? <p className="mt-2 text-sm leading-6 text-rose-700">{description}</p> : null}
    </div>
  );
}

export function PriceBreakdown({
  subtotal = 0,
  addonTotal = 0,
  discountTotal = 0,
  taxTotal = 0,
  total = 0,
}: PriceBreakdownProps) {
  const rows = [
    ["Subtotal", subtotal],
    ["Add-ons", addonTotal],
    ["Discount", discountTotal],
    ["Tax", taxTotal],
    ["Total", total],
  ];

  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-5">
      <h3 className="text-lg font-semibold text-title">Price breakdown</h3>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map(([label, value]) => (
          <div key={label as string} className="flex items-center justify-between gap-3">
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-semibold text-title">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function BookingForm({ title, description, children, onSubmit }: SimpleFormProps) {
  return (
    <form onSubmit={onSubmit} className="rounded-[2rem] border border-border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-title">{title}</h2>
        {description ? <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p> : null}
      </div>
      <div className="space-y-5">{children}</div>
    </form>
  );
}

export function TravelerForm({ children }: { children: ReactNode }) {
  return <div className="rounded-[1.75rem] border border-border bg-slate-50 p-5">{children}</div>;
}

export function AddonSelector({ children }: { children: ReactNode }) {
  return <div className="rounded-[1.75rem] border border-border bg-white p-5">{children}</div>;
}

export function ConfirmDialog({ children }: { children: ReactNode }) {
  return <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">{children}</div>;
}

export function ImageAssetPicker({ label = "Choose image" }: { label?: string }) {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-xl border border-dashed border-border px-4 py-3 text-sm font-semibold text-slate-600"
    >
      {label}
    </button>
  );
}
