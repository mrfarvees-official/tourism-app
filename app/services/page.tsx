import { ServiceCard } from "@/src/shared/components/tourism";
import { PublicTourismPage } from "@/src/shared/components/publicTourismPage";

const services = [
  {
    title: "Airport Transfer",
    subtitle: "Fixed pricing",
    description: "Reliable airport pickup and drop-off with vehicle options for all group sizes.",
    meta: "Transport",
    href: "/services/airport-transfer",
  },
  {
    title: "Guided City Tour",
    subtitle: "Per person",
    description: "A flexible city experience for guests who want an easy add-on to a package.",
    meta: "Guided",
    href: "/services/guided-city-tour",
  },
  {
    title: "Private Chauffeur",
    subtitle: "Custom",
    description: "Full-day private transport support for premium travelers and multi-stop itineraries.",
    meta: "Premium",
    href: "/services/private-chauffeur",
  },
];

export default function ServicesPage() {
  return (
    <PublicTourismPage
      eyebrow="Services"
      title="Travel services and add-ons"
      description="Offer fixed, per-person, per-day, or custom services alongside packages and experiences."
    >
      {services.map((service) => (
        <ServiceCard key={service.title} {...service} />
      ))}
    </PublicTourismPage>
  );
}
