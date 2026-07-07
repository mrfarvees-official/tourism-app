import { PublicDetailPage } from "@/src/shared/components/publicTourismPage";

export default async function PackageDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PublicDetailPage
      eyebrow="Package"
      title="Package details"
      slug={slug}
      description="The package detail route is ready for live CMS content, pricing, and booking requests."
    />
  );
}
