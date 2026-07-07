import { PackageCard } from "@/src/shared/components/tourism";
import { PublicTourismPage } from "@/src/shared/components/publicTourismPage";

const packages = [
  {
    title: "Sri Lanka Highlights",
    subtitle: "7 days",
    description: "A balanced package covering culture, hills, and coast with flexible add-ons.",
    meta: "From LKR",
    href: "/packages/sri-lanka-highlights",
  },
  {
    title: "Adventure Escape",
    subtitle: "5 days",
    description: "For travelers who want hiking, waterfalls, and active experiences.",
    meta: "Active",
    href: "/packages/adventure-escape",
  },
  {
    title: "Luxury Private Tour",
    subtitle: "Custom",
    description: "Premium itineraries with private drivers, selected stays, and curated service.",
    meta: "Private",
    href: "/packages/luxury-private-tour",
  },
];

export default function PackagesPage() {
  return (
    <PublicTourismPage
      eyebrow="Packages"
      title="Tour packages built for conversion"
      description="Publish private, group, or custom packages with itineraries, pricing, and booking-ready details."
    >
      {packages.map((pkg) => (
        <PackageCard key={pkg.title} {...pkg} />
      ))}
    </PublicTourismPage>
  );
}
