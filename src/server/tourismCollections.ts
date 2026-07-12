export type TourismCollectionItem = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  status: string;
  amount?: string;
  image?: string;
  imageUrl?: string;
  image_url?: string;
  fields?: Record<string, unknown>;
  meta?: string;
  href?: string;
};

function apiOrigin() {
  return (process.env.NEXT_PUBLIC_API_ORIGIN ?? process.env.API_ORIGIN ?? "").replace(/\/+$/, "");
}

function unwrapCollection(payload: unknown): TourismCollectionItem[] {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return [];
  }

  const record = payload as {
    data?: unknown;
    items?: unknown;
  };

  const candidates = [record.data, record.items, payload];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as TourismCollectionItem[];
    }

    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      const nested = candidate as { items?: unknown; data?: unknown };
      if (Array.isArray(nested.items)) {
        return nested.items as TourismCollectionItem[];
      }
      if (Array.isArray(nested.data)) {
        return nested.data as TourismCollectionItem[];
      }
    }
  }

  return [];
}

function normalizeCollectionItem(item: TourismCollectionItem): TourismCollectionItem {
  const image = item.image ?? item.imageUrl ?? item.image_url ?? undefined;

  return {
    ...item,
    image,
    imageUrl: item.imageUrl ?? item.image_url ?? image,
    image_url: item.image_url ?? item.imageUrl ?? image,
  };
}

export async function loadPublicCollection(
  resource: "destinations" | "packages" | "services" | "activities",
  tenantKey = "lanka-trails",
): Promise<TourismCollectionItem[]> {
  const origin = apiOrigin();
  if (!origin) {
    return [];
  }

  try {
    const response = await fetch(
      new URL(`/api/public/${encodeURIComponent(tenantKey)}/${resource}`, `${origin}/`),
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      },
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as unknown;
    return unwrapCollection((payload as { data?: unknown }).data ?? payload).map(normalizeCollectionItem);
  } catch {
    return [];
  }
}

export async function loadPublicItem(
  resource: "destinations" | "packages" | "services" | "activities",
  slug: string,
  tenantKey = "lanka-trails",
): Promise<TourismCollectionItem | null> {
  const items = await loadPublicCollection(resource, tenantKey);
  return items.find((item) => item.slug === slug) ?? items[0] ?? null;
}
