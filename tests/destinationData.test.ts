import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function loadDestinationData() {
  vi.resetModules();
  return import("../src/server/destinationData");
}

describe("destination data store", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-13T00:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns seeded destinations ordered by latest update first", async () => {
    const { listDestinations } = await loadDestinationData();
    const slugs = listDestinations().map((destination) => destination.slug);

    expect(slugs).toEqual(["mirissa", "ella", "sigiriya"]);
  });

  it("maps records into public list items", async () => {
    const { listDestinationRecords } = await loadDestinationData();
    const [first] = listDestinationRecords();

    expect(first.title).toBe("Mirissa");
    expect(first.href).toBe("/destinations/mirissa");
    expect(first.subtitle).toBe("South Coast • Southern • Matara");
    expect(first.meta).toBe("active");
    expect(first.allowed_fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "region", visible: true }),
        expect.objectContaining({ name: "featured", type: "bool" }),
      ]),
    );
  });

  it("paginates destination records with stable metadata", async () => {
    const { listDestinationRecordsPage } = await loadDestinationData();
    const page = listDestinationRecordsPage(undefined, 1, 2);

    expect(page.items).toHaveLength(2);
    expect(page.meta).toEqual({
      total: 3,
      per_page: 2,
      current_page: 1,
      last_page: 2,
      from: 1,
      to: 2,
    });
  });

  it("creates a destination with normalized defaults", async () => {
    const { createDestination, getDestination } = await loadDestinationData();

    const record = createDestination({
      tenantKey: "  custom-tenant  ",
      destinationName: "  Unawatuna Beach  ",
    });

    expect(record.tenantKey).toBe("custom-tenant");
    expect(record.slug).toBe("unawatuna-beach");
    expect(record.status).toBe("draft");
    expect(record.imageUrl).toBe("/no-image.jpg");
    expect(getDestination(record.slug, "custom-tenant")).toEqual(record);
  });

  it("updates a destination and preserves unspecified fields", async () => {
    const { createDestination, updateDestination } = await loadDestinationData();

    const record = createDestination({
      tenantKey: "custom-tenant",
      destinationName: "Kitulgala",
      description: "River runs",
    });

    const updated = updateDestination(record.slug, {
      tenantKey: "custom-tenant",
      destinationName: "Kitulgala Adventure",
      featured: true,
    });

    expect(updated?.destinationName).toBe("Kitulgala Adventure");
    expect(updated?.description).toBe("River runs");
    expect(updated?.featured).toBe(true);
    expect(updated?.slug).toBe("kitulgala");
  });

  it("returns null when trying to update a missing destination", async () => {
    const { updateDestination } = await loadDestinationData();

    expect(
      updateDestination("missing", {
        tenantKey: "custom-tenant",
        destinationName: "Nowhere",
      }),
    ).toBeNull();
  });

  it("deletes destinations by slug", async () => {
    const { createDestination, deleteDestination, getDestination } = await loadDestinationData();

    const record = createDestination({
      tenantKey: "custom-tenant",
      destinationName: "Bentota",
    });

    expect(deleteDestination(record.slug, "custom-tenant")).toBe(true);
    expect(getDestination(record.slug, "custom-tenant")).toBeNull();
  });

  it("exposes a list item response for a destination record", async () => {
    const { getDestination, buildDestinationResponse } = await loadDestinationData();
    const record = getDestination("sigiriya");

    expect(record).not.toBeNull();
    expect(buildDestinationResponse(record!)).toMatchObject({
      title: "Sigiriya",
      href: "/destinations/sigiriya",
      image: "/no-image.jpg",
    });
  });

  it("generates a next id after seeding and creating records", async () => {
    const { nextDestinationId, createDestination } = await loadDestinationData();

    expect(nextDestinationId()).toBe(4);
    createDestination({
      tenantKey: "custom-tenant",
      destinationName: "Haputale",
    });
    expect(nextDestinationId("custom-tenant")).toBe(5);
  });
});
