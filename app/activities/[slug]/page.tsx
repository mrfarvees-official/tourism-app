import { PublicDetailPage } from "@/src/shared/components/publicTourismPage";
import { loadPublicItem } from "@/src/server/tourismCollections";

export default async function ActivityDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await loadPublicItem("activities", slug, "lanka-trails");

  return (
    <PublicDetailPage
      eyebrow="Activity"
      title={item?.title ?? "Activity details"}
      slug={slug}
      image={item?.image}
      meta={item?.amount ?? item?.status}
      fields={item?.fields}
      description={item?.description ?? "This activity route is ready for live content, availability, and pricing."}
      actionNote="Use this page to confirm the add-on and start booking."
    />
  );
}
