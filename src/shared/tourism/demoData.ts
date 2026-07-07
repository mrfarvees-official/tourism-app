export type TourismItem = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  status: "active" | "draft" | "pending" | "confirmed" | "paid" | "completed";
  amount?: string;
  image?: string;
  fields?: Record<string, unknown>;
};

export const destinations: TourismItem[] = [
  {
    id: 1,
    slug: "sigiriya",
    title: "Sigiriya",
    subtitle: "Cultural triangle",
    description: "Guided heritage visits, village lunches, and nearby nature stops.",
    status: "active",
    image: "/no-image.jpg",
    fields: {
      region: "Central Province",
      best_for: "Heritage travel",
      highlights: "Rock fortress, village lunches, day tours",
    },
  },
  {
    id: 2,
    slug: "ella",
    title: "Ella",
    subtitle: "Hill country",
    description: "Rail journeys, tea trails, waterfalls, and relaxed boutique stays.",
    status: "active",
    image: "/no-image.jpg",
    fields: {
      region: "Uva Province",
      best_for: "Scenic trips",
      highlights: "Tea estates, train rides, viewpoints",
    },
  },
  {
    id: 3,
    slug: "mirissa",
    title: "Mirissa",
    subtitle: "South coast",
    description: "Beach breaks, whale watching, seafood dining, and coastal transfers.",
    status: "active",
    image: "/no-image.jpg",
    fields: {
      region: "Southern Province",
      best_for: "Beach escapes",
      highlights: "Whale watching, sunsets, seafood",
    },
  },
];

export const packages: TourismItem[] = [
  {
    id: 1,
    slug: "sri-lanka-highlights",
    title: "Sri Lanka Highlights",
    subtitle: "7 days / 6 nights",
    description: "Culture, tea country, wildlife, and coast in one practical itinerary.",
    status: "active",
    amount: "LKR 185,000",
  },
  {
    id: 2,
    slug: "hill-country-weekend",
    title: "Hill Country Weekend",
    subtitle: "3 days / 2 nights",
    description: "A compact private trip with train scenery, hikes, and tea estates.",
    status: "active",
    amount: "LKR 72,000",
  },
  {
    id: 3,
    slug: "custom-family-tour",
    title: "Custom Family Tour",
    subtitle: "Custom",
    description: "Flexible routing, private driver, child-friendly stays, and easy pacing.",
    status: "draft",
    amount: "Custom",
  },
];

export const services: TourismItem[] = [
  {
    id: 1,
    slug: "airport-transfer",
    title: "Airport Transfer",
    subtitle: "Fixed price",
    description: "Private airport pickup and drop-off with vehicle size options.",
    status: "active",
    amount: "LKR 14,500",
  },
  {
    id: 2,
    slug: "private-chauffeur",
    title: "Private Chauffeur",
    subtitle: "Per day",
    description: "Full-day driver service for multi-stop routes and custom itineraries.",
    status: "active",
    amount: "LKR 22,000",
  },
];

export const activities: TourismItem[] = [
  {
    id: 1,
    slug: "tea-estate-walk",
    title: "Tea Estate Walk",
    subtitle: "2 hours",
    description: "Guided estate walk with tea tasting and local host storytelling.",
    status: "active",
    amount: "LKR 8,500",
  },
  {
    id: 2,
    slug: "whale-watching",
    title: "Whale Watching",
    subtitle: "Half day",
    description: "Seasonal ocean experience with pickup support from south coast stays.",
    status: "active",
    amount: "LKR 18,000",
  },
];

export const bookings: TourismItem[] = [
  {
    id: 101,
    slug: "TBK-2026-000101",
    title: "TBK-2026-000101",
    subtitle: "Sri Lanka Highlights",
    description: "Ayesha Khan, 2 adults, travel date 2026-08-14.",
    status: "confirmed",
    amount: "LKR 370,000",
  },
  {
    id: 102,
    slug: "TBK-2026-000102",
    title: "TBK-2026-000102",
    subtitle: "Hill Country Weekend",
    description: "Daniel Perera, 1 adult and 1 child, travel date 2026-08-22.",
    status: "pending",
    amount: "LKR 116,000",
  },
];

export const inquiries: TourismItem[] = [
  {
    id: 201,
    slug: "inquiry-201",
    title: "Custom honeymoon request",
    subtitle: "New inquiry",
    description: "Looking for a 9 day private trip with hill country and south coast.",
    status: "pending",
  },
  {
    id: 202,
    slug: "inquiry-202",
    title: "Airport transfer question",
    subtitle: "Contacted",
    description: "Needs a van for 5 travelers arriving at midnight.",
    status: "confirmed",
  },
];

export const reviews: TourismItem[] = [
  {
    id: 301,
    slug: "review-301",
    title: "Excellent planning",
    subtitle: "5 stars",
    description: "The team handled the route, transport, and hotel changes clearly.",
    status: "active",
  },
];

export const moduleData = {
  destinations,
  packages,
  services,
  activities,
  accommodations: [
    {
      id: 401,
      slug: "ella-view-resort",
      title: "Ella View Resort",
      subtitle: "Resort",
      description: "Hill country stay option with family rooms and breakfast.",
      status: "active",
      amount: "LKR 38,000",
    },
  ] satisfies TourismItem[],
  transport: [
    {
      id: 501,
      slug: "private-van",
      title: "Private Van",
      subtitle: "6 seats",
      description: "Comfortable private van for family and small-group routes.",
      status: "active",
      amount: "LKR 28,000/day",
    },
  ] satisfies TourismItem[],
  bookings,
  inquiries,
  reviews,
};
