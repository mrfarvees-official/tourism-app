import { PublicDetailPage } from "@/src/shared/components/publicTourismPage";
import { getDestinationListItem } from "@/src/server/destinationData";

export default async function DestinationDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestinationListItem(slug, "lanka-trails");

  return (
    <PublicDetailPage
      eyebrow="Destination"
      title={destination?.title ?? "Destination details"}
      slug={slug}
      image={destination?.image}
      meta={destination?.meta}
      fields={destination?.fields}
      description={
        destination?.description ??
        "This route is ready for live destination content from the tourism CMS and API."
      }
      actionNote={
        destination?.fields?.story
          ? "Use the booking flow to request this route with your preferred dates, travelers, and transfer needs."
          : "Review the destination and start a booking request when you are ready."
      }
    />
  );
}
