import { DestinationCard } from "@/src/shared/components/tourism";
import { PublicTourismPage } from "@/src/shared/components/publicTourismPage";
import { listDestinationRecords } from "@/src/server/destinationData";

export default function DestinationsPage() {
  const destinations = listDestinationRecords("lanka-trails");

  return (
    <PublicTourismPage
      eyebrow="Destinations"
      title="Browse tourism destinations"
      description="Discover curated destination pages that can be paired with packages, activities, stays, and transport."
    >
      {destinations.map((destination) => (
        <DestinationCard key={destination.id} {...destination} />
      ))}
    </PublicTourismPage>
  );
}
