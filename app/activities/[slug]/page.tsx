import { PublicDetailPage } from "@/src/shared/components/publicTourismPage";

export default async function ActivityDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <PublicDetailPage
      eyebrow="Activity"
      title="Activity details"
      slug={slug}
      description="This activity route is ready for live content, availability, and pricing."
    />
  );
}
