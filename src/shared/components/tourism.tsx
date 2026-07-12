"use client";

import Link from "next/link";
import { ReactNode } from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  meta?: string;
  fields?: Record<string, unknown>;
  image?: string;
  imageAlt?: string;
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

function Card({
  title,
  subtitle,
  description,
  href,
  meta,
  fields,
  image,
  imageAlt,
}: CardProps) {
  const orderedFields = Object.entries(fields ?? {})
    .filter(([key, value]) => !["id", "slug", "title", "subtitle", "description", "status", "amount", "meta", "href", "image", "image_url", "imageUrl", "fields"].includes(key) && value !== null && value !== undefined && value !== "")
    .slice(0, 3);

  const content = (
    <article className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      {image ? (
        <div className="mb-5 overflow-hidden rounded-[1.5rem] bg-slate-100">
          <img
            src={image}
            alt={imageAlt ?? title}
            className="h-56 w-full object-cover transition duration-700 hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-title">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm font-medium text-primary">{subtitle}</p>
          ) : null}
        </div>
        {meta ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {meta}
          </span>
        ) : null}
      </div>
      {description ? (
        <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
      {orderedFields.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {orderedFields.map(([key, value]) => (
            <div key={key} className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                {humanizeField(key)}
              </p>
              <p className="mt-1 text-sm font-semibold leading-6 text-title">
                {formatFieldValue(value)}
              </p>
            </div>
          ))}
        </div>
      ) : null}
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

function formatFieldValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (Array.isArray(value))
    return value.map((item) => formatFieldValue(item)).join(", ");
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
    "image_url",
    "imageUrl",
    "imageAlt",
    "fields",
    "allowedFields",
    "allowed_fields",
    "schema_blueprint",
    "updated_at",
  ]);

  const isFeatured =
    fields?.featured === true ||
    fields?.is_featured === true ||
    fields?.featured === "true" ||
    fields?.is_featured === "true";

  const orderedFields = allowedFields?.length
    ? allowedFields
        .filter((field) => field.visible !== false)
        .filter(
          (field) =>
            ![
              "image",
              "image_url",
              "imageUrl",
              "featured",
              "is_featured",
            ].includes(field.name),
        )
        .map((field) => ({
          key: field.name,
          label: field.label ?? humanizeField(field.name),
          type: field.type,
          value: fields?.[field.name],
        }))
    : allowed_fields?.length
      ? allowed_fields
          .filter((field) => field.visible !== false)
          .filter(
            (field) =>
              ![
                "image",
                "image_url",
                "imageUrl",
                "featured",
                "is_featured",
              ].includes(field.name),
          )
          .map((field) => ({
            key: field.name,
            label: field.label ?? humanizeField(field.name),
            type: field.type,
            value: fields?.[field.name],
          }))
      : Object.entries(fields ?? {})
          .filter(([key]) => !knownKeys.has(key))
          .filter(
            ([key]) =>
              ![
                "image",
                "image_url",
                "imageUrl",
                "featured",
                "is_featured",
              ].includes(key),
          )
          .map(([key, value]) => ({
            key,
            label: humanizeField(key),
            value,
          }));

  const storyFields = orderedFields.slice(0, 4);

  const content = (
    <article className="group overflow-hidden rounded-[2rem] border border-border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative min-h-[420px] overflow-hidden">
        <img
          src={image ?? "/no-image.jpg"}
          alt={imageAlt ?? title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

        {meta ? (
          <div className="absolute left-5 top-5">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
              {meta}
            </span>
          </div>
        ) : null}

        {isFeatured ? (
          <div className="absolute right-5 top-5">
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Featured
            </span>
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          {subtitle ? (
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.22em] text-white/80">
              {subtitle}
            </p>
          ) : null}

          <h3 className="max-w-xl text-3xl font-semibold leading-tight">
            {title}
          </h3>

          {description ? (
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/85">
              {description}
            </p>
          ) : null}

          {storyFields.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {storyFields.map((field) => (
                <div
                  key={field.key}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur"
                >
                  <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">
                    {field.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">
                    {formatFieldValue(field.value)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="mt-6 inline-flex items-center text-sm font-semibold text-white">
            Book now
            <span className="ml-2 transition group-hover:translate-x-1">→</span>
          </div>
        </div>
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
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {value}
    </span>
  );
}

export function PaymentStatusBadge({ value, tone = "neutral" }: BadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
    >
      {value}
    </span>
  );
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
      {description ? (
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      ) : null}
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
      {description ? (
        <p className="mt-2 text-sm leading-6 text-rose-700">{description}</p>
      ) : null}
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
          <div
            key={label as string}
            className="flex items-center justify-between gap-3"
          >
            <dt className="text-slate-500">{label}</dt>
            <dd className="font-semibold text-title">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function BookingForm({
  title,
  description,
  children,
  onSubmit,
}: SimpleFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-[2rem] border border-border bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-title">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        ) : null}
      </div>
      <div className="space-y-5">{children}</div>
    </form>
  );
}

export function TravelerForm({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-border bg-slate-50 p-5">
      {children}
    </div>
  );
}

export function AddonSelector({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-5">
      {children}
    </div>
  );
}

export function ConfirmDialog({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-5 shadow-sm">
      {children}
    </div>
  );
}

export function ImageAssetPicker({
  label = "Choose image",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-xl border border-dashed border-border px-4 py-3 text-sm font-semibold text-slate-600"
    >
      {label}
    </button>
  );
}
