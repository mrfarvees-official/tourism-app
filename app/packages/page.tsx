import { PackageCard } from "@/src/shared/components/tourism";
import { PublicTourismPage } from "@/src/shared/components/publicTourismPage";
import { loadPublicCollection } from "@/src/server/tourismCollections";

export default async function PackagesPage() {
  const packages = await loadPublicCollection("packages", "lanka-trails");

  return (
    <PublicTourismPage
      eyebrow="Packages"
      title="Tour packages built for conversion"
      description="Publish private, group, or custom packages with itineraries, pricing, and booking-ready details."
    >
      {packages.map((pkg) => (
        <PackageCard
          key={`${pkg.slug}-${pkg.id}`}
          title={pkg.title}
          subtitle={pkg.subtitle}
          description={pkg.description}
          meta={pkg.amount ?? pkg.status}
          image={pkg.image}
          href={`/packages/${pkg.slug}`}
          fields={pkg.fields}
        />
      ))}
    </PublicTourismPage>
  );
}
