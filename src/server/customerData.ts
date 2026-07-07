import { randomUUID } from "crypto";

export type BookingStatus = "draft" | "pending" | "confirmed" | "checked_in" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";
export type ReviewStatus = "draft" | "submitted" | "published";

export type CustomerProfile = {
  id: string;
  tenantKey: string;
  name: string;
  email: string;
  phone: string;
  nationality: string;
  passportNumber: string;
  preferredLanguage: string;
  loyaltyTier: "Explorer" | "Insider" | "VIP";
  emergencyContact: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

export type CustomerBooking = {
  id: string;
  reference: string;
  tenantKey: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  destination: string;
  travelDate: string;
  returnDate: string;
  adults: number;
  children: number;
  infants: number;
  travelersCount: number;
  totalAmount: number;
  paidAmount: number;
  currency: string;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentDueDate: string;
  createdAt: string;
  updatedAt: string;
  notes: string;
  addOns: string[];
  supportContact: string;
  itinerary: string[];
};

export type CustomerReview = {
  id: string;
  bookingId: string;
  tenantKey: string;
  customerId: string;
  title: string;
  message: string;
  rating: number;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
};

export type CustomerDashboardData = {
  tenant: {
    key: string;
    name: string;
    supportEmail: string;
  };
  profile: CustomerProfile;
  summary: {
    upcomingTrips: number;
    completedTrips: number;
    pendingPayments: number;
    totalSpent: string;
    reviewCount: number;
    loyaltyTier: CustomerProfile["loyaltyTier"];
  };
  nextTrip: CustomerBooking | null;
  bookings: CustomerBooking[];
  reviews: CustomerReview[];
  tasks: Array<{
    id: string;
    title: string;
    detail: string;
    status: "open" | "in_progress" | "done" | "attention";
    actionLabel?: string;
    href?: string;
  }>;
  support: Array<{
    id: string;
    title: string;
    detail: string;
    updatedAt: string;
  }>;
};

const DEFAULT_TENANT = "lanka-trails";
const DEFAULT_CUSTOMER_ID = "cust_demo_001";
const DEFAULT_PROFILE_UPDATED_AT = "2026-07-03T09:30:00.000Z";

const profile: CustomerProfile = {
  id: DEFAULT_CUSTOMER_ID,
  tenantKey: DEFAULT_TENANT,
  name: "Ayesha Khan",
  email: "ayesha.khan@example.com",
  phone: "+94 77 123 4567",
  nationality: "Sri Lankan",
  passportNumber: "N1234567",
  preferredLanguage: "English",
  loyaltyTier: "Insider",
  emergencyContact: "+94 77 765 4321",
  address: "45 Marine Drive, Colombo 03",
  createdAt: "2026-01-10T08:00:00.000Z",
  updatedAt: DEFAULT_PROFILE_UPDATED_AT,
};

const seedBookings: CustomerBooking[] = [
  {
    id: "bk_001",
    reference: "TBK-2026-000101",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Sri Lanka Highlights",
    destination: "Sigiriya, Kandy, Ella, Mirissa",
    travelDate: "2026-08-14",
    returnDate: "2026-08-20",
    adults: 2,
    children: 0,
    infants: 0,
    travelersCount: 2,
    totalAmount: 370000,
    paidAmount: 185000,
    currency: "LKR",
    bookingStatus: "confirmed",
    paymentStatus: "partial",
    paymentDueDate: "2026-08-07",
    createdAt: "2026-06-27T10:15:00.000Z",
    updatedAt: "2026-07-01T13:05:00.000Z",
    notes: "Pickup requested from Bandaranaike International Airport.",
    addOns: ["Airport transfer", "Private driver", "Cultural guide"],
    supportContact: "operations@lankatrails.example",
    itinerary: ["Arrival in Colombo", "Sigiriya day trip", "Kandy temple trail", "Ella tea country", "South coast"],
  },
  {
    id: "bk_002",
    reference: "TBK-2026-000102",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Hill Country Weekend",
    destination: "Nuwara Eliya, Ella",
    travelDate: "2026-08-22",
    returnDate: "2026-08-24",
    adults: 1,
    children: 1,
    infants: 0,
    travelersCount: 2,
    totalAmount: 116000,
    paidAmount: 116000,
    currency: "LKR",
    bookingStatus: "confirmed",
    paymentStatus: "paid",
    paymentDueDate: "2026-08-20",
    createdAt: "2026-06-29T08:20:00.000Z",
    updatedAt: "2026-07-02T11:40:00.000Z",
    notes: "Child seat requested for the transfer.",
    addOns: ["Child seat", "Train tickets"],
    supportContact: "support@lankatrails.example",
    itinerary: ["Nanu Oya pickup", "Tea estate walk", "Ella day excursion"],
  },
  {
    id: "bk_003",
    reference: "TBK-2026-000103",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Southern Coast Escape",
    destination: "Mirissa, Galle",
    travelDate: "2026-09-04",
    returnDate: "2026-09-08",
    adults: 2,
    children: 0,
    infants: 0,
    travelersCount: 2,
    totalAmount: 248000,
    paidAmount: 0,
    currency: "LKR",
    bookingStatus: "pending",
    paymentStatus: "unpaid",
    paymentDueDate: "2026-08-30",
    createdAt: "2026-07-01T15:35:00.000Z",
    updatedAt: "2026-07-04T14:10:00.000Z",
    notes: "Sea-view room preference.",
    addOns: ["Whale watching", "Airport transfer"],
    supportContact: "bookings@lankatrails.example",
    itinerary: ["Galle Fort", "Mirissa beach time", "Whale watching", "Spa afternoon"],
  },
  {
    id: "bk_004",
    reference: "TBK-2026-000104",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Cultural Triangle Tour",
    destination: "Anuradhapura, Sigiriya, Polonnaruwa",
    travelDate: "2026-09-14",
    returnDate: "2026-09-19",
    adults: 2,
    children: 1,
    infants: 0,
    travelersCount: 3,
    totalAmount: 312000,
    paidAmount: 156000,
    currency: "LKR",
    bookingStatus: "confirmed",
    paymentStatus: "partial",
    paymentDueDate: "2026-09-04",
    createdAt: "2026-07-02T09:25:00.000Z",
    updatedAt: "2026-07-05T07:55:00.000Z",
    notes: "Need early morning departures for temple visits.",
    addOns: ["Private guide", "Lunch stops"],
    supportContact: "operations@lankatrails.example",
    itinerary: ["Anuradhapura", "Sigiriya climb", "Polonnaruwa bike tour"],
  },
  {
    id: "bk_005",
    reference: "TBK-2026-000105",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Wildlife and Waterfalls",
    destination: "Yala, Ella",
    travelDate: "2026-10-02",
    returnDate: "2026-10-06",
    adults: 2,
    children: 0,
    infants: 0,
    travelersCount: 2,
    totalAmount: 295000,
    paidAmount: 0,
    currency: "LKR",
    bookingStatus: "draft",
    paymentStatus: "unpaid",
    paymentDueDate: "2026-09-25",
    createdAt: "2026-07-02T12:55:00.000Z",
    updatedAt: "2026-07-02T12:55:00.000Z",
    notes: "Customer asked for jeep safari options.",
    addOns: ["Safari jeep", "Waterfall stop"],
    supportContact: "bookings@lankatrails.example",
    itinerary: ["Yala safari", "Ella trek", "Tea factory visit"],
  },
  {
    id: "bk_006",
    reference: "TBK-2026-000106",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Luxury Private Tour",
    destination: "Colombo, Galle, Bentota",
    travelDate: "2026-10-18",
    returnDate: "2026-10-23",
    adults: 2,
    children: 0,
    infants: 0,
    travelersCount: 2,
    totalAmount: 465000,
    paidAmount: 232500,
    currency: "LKR",
    bookingStatus: "confirmed",
    paymentStatus: "partial",
    paymentDueDate: "2026-10-07",
    createdAt: "2026-07-03T10:05:00.000Z",
    updatedAt: "2026-07-05T18:10:00.000Z",
    notes: "Prefers boutique hotels and late check-out.",
    addOns: ["Private chauffeur", "Spa reservation"],
    supportContact: "vip@lankatrails.example",
    itinerary: ["City arrival", "Galle day tour", "Bentota coast", "Private farewell dinner"],
  },
  {
    id: "bk_007",
    reference: "TBK-2026-000107",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Weekend Reset",
    destination: "Kandy",
    travelDate: "2026-11-01",
    returnDate: "2026-11-03",
    adults: 1,
    children: 0,
    infants: 0,
    travelersCount: 1,
    totalAmount: 88000,
    paidAmount: 0,
    currency: "LKR",
    bookingStatus: "pending",
    paymentStatus: "unpaid",
    paymentDueDate: "2026-10-27",
    createdAt: "2026-07-03T14:45:00.000Z",
    updatedAt: "2026-07-04T15:15:00.000Z",
    notes: "Single-room stay with early pickup.",
    addOns: ["City guide"],
    supportContact: "support@lankatrails.example",
    itinerary: ["Temple visit", "Lake walk", "Tea lounge stop"],
  },
  {
    id: "bk_008",
    reference: "TBK-2026-000108",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Family Discovery",
    destination: "Bentota, Colombo",
    travelDate: "2026-11-14",
    returnDate: "2026-11-19",
    adults: 2,
    children: 2,
    infants: 0,
    travelersCount: 4,
    totalAmount: 332000,
    paidAmount: 332000,
    currency: "LKR",
    bookingStatus: "completed",
    paymentStatus: "paid",
    paymentDueDate: "2026-11-02",
    createdAt: "2026-07-01T06:10:00.000Z",
    updatedAt: "2026-07-06T09:45:00.000Z",
    notes: "Completed booking with family-friendly timing.",
    addOns: ["Family van", "Flexible meals"],
    supportContact: "bookings@lankatrails.example",
    itinerary: ["Bentota beach", "Colombo museum day", "Departure"],
  },
  {
    id: "bk_009",
    reference: "TBK-2026-000109",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Tea Trails Escape",
    destination: "Nuwara Eliya, Hatton",
    travelDate: "2026-12-03",
    returnDate: "2026-12-07",
    adults: 2,
    children: 0,
    infants: 0,
    travelersCount: 2,
    totalAmount: 268000,
    paidAmount: 134000,
    currency: "LKR",
    bookingStatus: "confirmed",
    paymentStatus: "partial",
    paymentDueDate: "2026-11-23",
    createdAt: "2026-07-04T07:25:00.000Z",
    updatedAt: "2026-07-06T12:30:00.000Z",
    notes: "Requested room with balcony views.",
    addOns: ["Tea tasting", "Driver overnight stay"],
    supportContact: "operations@lankatrails.example",
    itinerary: ["Tea estate walk", "Scenic train", "Waterfall stop"],
  },
  {
    id: "bk_010",
    reference: "TBK-2026-000110",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    customerName: profile.name,
    customerEmail: profile.email,
    packageName: "Festival City Break",
    destination: "Colombo",
    travelDate: "2026-12-18",
    returnDate: "2026-12-21",
    adults: 2,
    children: 0,
    infants: 0,
    travelersCount: 2,
    totalAmount: 124000,
    paidAmount: 0,
    currency: "LKR",
    bookingStatus: "draft",
    paymentStatus: "unpaid",
    paymentDueDate: "2026-12-08",
    createdAt: "2026-07-06T09:35:00.000Z",
    updatedAt: "2026-07-06T09:35:00.000Z",
    notes: "Waiting on final hotel confirmation.",
    addOns: ["Airport transfer"],
    supportContact: "bookings@lankatrails.example",
    itinerary: ["Arrival", "Shopping", "City dining", "Departure"],
  },
];

const seedReviews: CustomerReview[] = [
  {
    id: "rv_001",
    bookingId: "bk_001",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    title: "Excellent trip planning",
    message: "The itinerary was practical, the driver was on time, and the support team responded fast.",
    rating: 5,
    status: "published",
    createdAt: "2026-07-06T08:30:00.000Z",
    updatedAt: "2026-07-06T08:30:00.000Z",
  },
  {
    id: "rv_002",
    bookingId: "bk_002",
    tenantKey: DEFAULT_TENANT,
    customerId: DEFAULT_CUSTOMER_ID,
    title: "Smooth hill-country weekend",
    message: "The child seat request was handled quickly and the schedule stayed relaxed.",
    rating: 5,
    status: "published",
    createdAt: "2026-07-06T09:45:00.000Z",
    updatedAt: "2026-07-06T09:45:00.000Z",
  },
];

const customerProfile = new Map<string, CustomerProfile>([[profile.id, profile]]);
const customerBookings = new Map<string, CustomerBooking[]>();
const customerReviews = new Map<string, CustomerReview[]>();

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function seedTenant(tenantKey: string) {
  if (!customerBookings.has(tenantKey)) {
    customerBookings.set(
      tenantKey,
      seedBookings.filter((booking) => booking.tenantKey === tenantKey).map(clone),
    );
  }

  if (!customerReviews.has(tenantKey)) {
    customerReviews.set(
      tenantKey,
      seedReviews.filter((review) => review.tenantKey === tenantKey).map(clone),
    );
  }
}

seedTenant(DEFAULT_TENANT);

function ensureTenantBookings(tenantKey: string) {
  if (!customerBookings.has(tenantKey)) {
    seedTenant(tenantKey);
  }

  return customerBookings.get(tenantKey) ?? [];
}

function ensureTenantReviews(tenantKey: string) {
  if (!customerReviews.has(tenantKey)) {
    seedTenant(tenantKey);
  }

  return customerReviews.get(tenantKey) ?? [];
}

function compareAsc(a: string, b: string) {
  return new Date(a).getTime() - new Date(b).getTime();
}

function nextReference(tenantKey: string) {
  const current = ensureTenantBookings(tenantKey);
  const base = current.length + 101;
  return `TBK-2026-${String(base).padStart(6, "0")}`;
}

function money(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCustomerProfile() {
  return clone(profile);
}

export function updateCustomerProfile(payload: Partial<CustomerProfile>) {
  const current = customerProfile.get(profile.id) ?? profile;
  const updated: CustomerProfile = {
    ...current,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  customerProfile.set(updated.id, updated);
  return clone(updated);
}

export function listCustomerBookings(tenantKey = DEFAULT_TENANT) {
  return clone(ensureTenantBookings(tenantKey).sort((a, b) => compareAsc(b.createdAt, a.createdAt)));
}

export function getCustomerBooking(identifier: string, tenantKey = DEFAULT_TENANT) {
  const bookings = ensureTenantBookings(tenantKey);
  const booking = bookings.find((item) => item.id === identifier || item.reference === identifier);
  return booking ? clone(booking) : null;
}

export function createCustomerBooking(input: {
  tenantKey?: string;
  customerName: string;
  customerEmail: string;
  packageName: string;
  destination: string;
  travelDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  paidAmount?: number;
  currency?: string;
  bookingStatus?: BookingStatus;
  paymentStatus?: PaymentStatus;
  paymentDueDate?: string;
  notes?: string;
  addOns?: string[];
  itinerary?: string[];
  supportContact?: string;
}) {
  const tenantKey = input.tenantKey?.trim() || DEFAULT_TENANT;
  const currentProfile = getCustomerProfile();
  const createdAt = new Date().toISOString();
  const booking: CustomerBooking = {
    id: randomUUID(),
    reference: nextReference(tenantKey),
    tenantKey,
    customerId: currentProfile.id,
    customerName: input.customerName.trim() || currentProfile.name,
    customerEmail: input.customerEmail.trim() || currentProfile.email,
    packageName: input.packageName.trim() || "Custom Booking",
    destination: input.destination.trim() || "Sri Lanka",
    travelDate: input.travelDate,
    returnDate: input.returnDate ?? input.travelDate,
    adults: Math.max(0, input.adults),
    children: Math.max(0, input.children),
    infants: Math.max(0, input.infants),
    travelersCount: Math.max(1, input.adults + input.children + input.infants),
    totalAmount: Math.max(0, input.totalAmount),
    paidAmount: Math.max(0, input.paidAmount ?? 0),
    currency: input.currency?.trim() || "LKR",
    bookingStatus: input.bookingStatus ?? "pending",
    paymentStatus: input.paymentStatus ?? ((input.paidAmount ?? 0) > 0 ? "partial" : "unpaid"),
    paymentDueDate: input.paymentDueDate ?? input.travelDate,
    createdAt,
    updatedAt: createdAt,
    notes: input.notes?.trim() || "",
    addOns: input.addOns ?? [],
    supportContact: input.supportContact?.trim() || "support@lankatrails.example",
    itinerary: input.itinerary ?? [],
  };

  const current = ensureTenantBookings(tenantKey);
  customerBookings.set(tenantKey, [booking, ...current]);
  return clone(booking);
}

export function listCustomerReviews(tenantKey = DEFAULT_TENANT) {
  return clone(ensureTenantReviews(tenantKey).sort((a, b) => compareAsc(b.createdAt, a.createdAt)));
}

export function createCustomerReview(input: {
  tenantKey?: string;
  bookingId: string;
  title: string;
  message: string;
  rating: number;
  status?: ReviewStatus;
}) {
  const tenantKey = input.tenantKey?.trim() || DEFAULT_TENANT;
  const createdAt = new Date().toISOString();
  const review: CustomerReview = {
    id: randomUUID(),
    bookingId: input.bookingId,
    tenantKey,
    customerId: profile.id,
    title: input.title.trim() || "Trip review",
    message: input.message.trim() || "",
    rating: Math.min(5, Math.max(1, input.rating || 5)),
    status: input.status ?? "submitted",
    createdAt,
    updatedAt: createdAt,
  };

  const current = ensureTenantReviews(tenantKey);
  customerReviews.set(tenantKey, [review, ...current]);
  return clone(review);
}

export function getCustomerDashboard(tenantKey = DEFAULT_TENANT): CustomerDashboardData {
  const bookings = listCustomerBookings(tenantKey);
  const reviews = listCustomerReviews(tenantKey);
  const currentProfile = getCustomerProfile();
  const upcomingTrips = bookings.filter((booking) => {
    const statusIsActive = booking.bookingStatus === "confirmed" || booking.bookingStatus === "pending" || booking.bookingStatus === "checked_in";
    return statusIsActive && new Date(booking.travelDate).getTime() >= Date.now() - 1000 * 60 * 60 * 24;
  }).length;
  const completedTrips = bookings.filter((booking) => booking.bookingStatus === "completed").length;
  const pendingPayments = bookings.filter((booking) => booking.paymentStatus !== "paid" && booking.bookingStatus !== "cancelled").length;
  const totalSpent = bookings.reduce((sum, booking) => sum + booking.paidAmount, 0);
  const nextTrip = bookings
    .filter((booking) => booking.bookingStatus !== "cancelled")
    .sort((a, b) => compareAsc(a.travelDate, b.travelDate))[0] ?? null;

  const tasks = [
    nextTrip
      ? {
          id: "trip-review",
          title: "Review your next trip details",
          detail: `${nextTrip.packageName} starts on ${nextTrip.travelDate}. Check passengers, pickup notes, and add-ons.`,
          status: "open" as const,
          actionLabel: "Open booking",
          href: `/customer/bookings/${nextTrip.reference}`,
        }
      : {
          id: "trip-review",
          title: "No upcoming trips",
          detail: "You do not have any confirmed trips yet. Start a new booking when you are ready.",
          status: "done" as const,
          actionLabel: "Start booking",
          href: "/booking/start",
        },
    pendingPayments > 0
      ? {
          id: "payment-followup",
          title: "Settle pending payments",
          detail: `${pendingPayments} booking${pendingPayments === 1 ? "" : "s"} still need a payment action.`,
          status: "attention" as const,
          actionLabel: "View bookings",
          href: "/customer/bookings",
        }
      : {
          id: "payment-followup",
          title: "All payments are up to date",
          detail: "Payment tracking is clear across your active bookings.",
          status: "done" as const,
        },
    reviews.length > 0
      ? {
          id: "review-followup",
          title: "Share trip feedback",
          detail: `You already shared ${reviews.length} review${reviews.length === 1 ? "" : "s"}. Keep feedback coming after each trip.`,
          status: "in_progress" as const,
          actionLabel: "See reviews",
          href: "/customer/reviews",
        }
      : {
          id: "review-followup",
          title: "Add your first review",
          detail: "Completed trips can be reviewed from the customer review screen.",
          status: "open" as const,
          actionLabel: "Write review",
          href: "/customer/reviews",
        },
  ];

  const support = bookings
    .slice(0, 3)
    .map((booking) => ({
      id: booking.id,
      title: `${booking.reference} - ${booking.packageName}`,
      detail: booking.notes || booking.itinerary[0] || "Support thread summary",
      updatedAt: booking.updatedAt,
    }));

  return {
    tenant: {
      key: tenantKey,
      name: "Lanka Trails",
      supportEmail: "support@lankatrails.example",
    },
    profile: getCustomerProfile(),
    summary: {
      upcomingTrips,
      completedTrips,
      pendingPayments,
      totalSpent: money(totalSpent, "LKR"),
      reviewCount: reviews.length,
      loyaltyTier: currentProfile.loyaltyTier,
    },
    nextTrip,
    bookings,
    reviews,
    tasks,
    support,
  };
}
