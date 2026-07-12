import { ServiceCard } from "@/src/shared/components/tourism";
import { PublicTourismPage } from "@/src/shared/components/publicTourismPage";
import { loadPublicCollection } from "@/src/server/tourismCollections";

export default async function ServicesPage() {
  const services = await loadPublicCollection("services", "lanka-trails");

  return (
    <PublicTourismPage
      eyebrow="Services"
      title="Travel services and add-ons"
      description="Offer fixed, per-person, per-day, or custom services alongside packages and experiences."
    >
      {services.map((service) => (
        <ServiceCard
          key={`${service.slug}-${service.id}`}
          title={service.title}
          subtitle={service.subtitle}
          description={service.description}
          meta={service.amount ?? service.status}
          image={service.image}
          href={`/services/${service.slug}`}
          fields={service.fields}
        />
      ))}
    </PublicTourismPage>
  );
}
