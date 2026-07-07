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
      description={
        destination?.description ??
        "This route is ready for live destination content from the tourism CMS and API."
      }
    />
  );
}
