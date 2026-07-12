import { PublicDetailPage } from "@/src/shared/components/publicTourismPage";
import { loadPublicItem } from "@/src/server/tourismCollections";

export default async function PackageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await loadPublicItem("packages", slug, "lanka-trails");

  return (
    <PublicDetailPage
      eyebrow="Package"
      title={item?.title ?? "Package details"}
      slug={slug}
      image={item?.image}
      meta={item?.amount ?? item?.status}
      fields={item?.fields}
      description={item?.description ?? "The package detail route is ready for live CMS content, pricing, and booking requests."}
      actionNote="Review the route, pacing, and inclusions, then start a booking request."
    />
  );
}
