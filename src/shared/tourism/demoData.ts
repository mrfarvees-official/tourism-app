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
      story:
        "Wake up near the ancient rock fortress, spend the morning with a local guide, and finish with a village lunch before a slow sunset drive through the paddy fields.",
      pace: "Balanced",
      best_time: "May to September",
      experience: "Heritage, culture, and soft adventure",
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
      story:
        "This is the hill-country chapter of the journey: train windows, tea terraces, waterfall stops, and boutique stays with long valley views.",
      pace: "Leisurely",
      best_time: "December to April",
      experience: "Rail journeys, tea trails, and viewpoints",
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
      story:
        "The coast closes the trip with ocean light, seafood dinners, and a chance to swap the road for a boat before heading back inland.",
      pace: "Relaxed",
      best_time: "November to April",
      experience: "Beach stays and marine experiences",
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
    fields: {
      story:
        "Built for travelers who want one clean route with cultural depth, scenic travel, and enough breathing room to enjoy each stop instead of rushing through it.",
      includes: "Private transfers, guide support, selected stays",
      route: "Sigiriya, Kandy, Ella, Mirissa",
      pace: "Comfortable",
      travelers: "Best for couples, families, and first-time visitors",
    },
  },
  {
    id: 2,
    slug: "hill-country-weekend",
    title: "Hill Country Weekend",
    subtitle: "3 days / 2 nights",
    description: "A compact private trip with train scenery, hikes, and tea estates.",
    status: "active",
    amount: "LKR 72,000",
    fields: {
      story:
        "A short mountain reset focused on cool air, rail views, and a couple of unhurried experiences that feel premium without becoming overly complex.",
      includes: "Rail-side stays, scenic drives, tea tastings",
      route: "Kandy, Nuwara Eliya, Ella",
      pace: "Leisurely",
      travelers: "Ideal for quick escapes and anniversary trips",
    },
  },
  {
    id: 3,
    slug: "custom-family-tour",
    title: "Custom Family Tour",
    subtitle: "Custom",
    description: "Flexible routing, private driver, child-friendly stays, and easy pacing.",
    status: "draft",
    amount: "Custom",
    fields: {
      story:
        "Designed around family rhythm, this package keeps transfers short, adds flexible meal timing, and leaves room for rest, pools, and optional activities.",
      includes: "Private driver, family rooms, flexible pacing",
      route: "Custom route",
      pace: "Flexible",
      travelers: "Best for multi-generation families",
    },
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
    fields: {
      story:
        "A simple arrival or departure transfer with a driver waiting at the terminal, so the trip starts and ends without friction.",
      coverage: "Colombo airport and nearby city hotels",
      vehicle: "Sedan, van, or family-size vehicle",
      response: "Flight-aware pickup coordination",
    },
  },
  {
    id: 2,
    slug: "private-chauffeur",
    title: "Private Chauffeur",
    subtitle: "Per day",
    description: "Full-day driver service for multi-stop routes and custom itineraries.",
    status: "active",
    amount: "LKR 22,000",
    fields: {
      story:
        "Use this when the route changes by the day. The driver stays with the trip, making it easy to add stops, switch timings, and keep the day calm.",
      coverage: "Island-wide day support",
      vehicle: "Private car or van",
      response: "Flexible routing with local coordination",
    },
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
    fields: {
      story:
        "A host-led walk through the estate, ending with tea tasting and a short conversation about picking, processing, and the local community.",
      includes: "Guide, tasting, light refreshments",
      best_for: "Hill-country itineraries and day visitors",
      pace: "Easy",
    },
  },
  {
    id: 2,
    slug: "whale-watching",
    title: "Whale Watching",
    subtitle: "Half day",
    description: "Seasonal ocean experience with pickup support from south coast stays.",
    status: "active",
    amount: "LKR 18,000",
    fields: {
      story:
        "An early-morning boat departure timed around calmer seas, with support for pickup and a realistic seasonal expectation message.",
      includes: "Boat ride, guide, pickup support",
      best_for: "Coastal stays and marine travel",
      pace: "Moderate",
    },
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
