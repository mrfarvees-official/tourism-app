import { PublicDetailPage } from "@/src/shared/components/publicTourismPage";
import { loadPublicItem } from "@/src/server/tourismCollections";

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await loadPublicItem("services", slug, "lanka-trails");

  return (
    <PublicDetailPage
      eyebrow="Service"
      title={item?.title ?? "Service details"}
      slug={slug}
      image={item?.image}
      meta={item?.amount ?? item?.status}
      fields={item?.fields}
      description={item?.description ?? "This service route is prepared for live service category and pricing data."}
      actionNote="Pick the support layer you need, then move into booking."
    />
  );
}
