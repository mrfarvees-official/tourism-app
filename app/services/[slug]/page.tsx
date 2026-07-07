import { PublicDetailPage } from "@/src/shared/components/publicTourismPage";

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PublicDetailPage
      eyebrow="Service"
      title="Service details"
      slug={slug}
      description="This service route is prepared for live service category and pricing data."
    />
  );
}
