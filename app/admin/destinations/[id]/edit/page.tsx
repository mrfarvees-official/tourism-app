import RouteShell from "@/src/shared/components/RouteShell";

export default async function AdminDestinationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RouteShell
      eyebrow="Admin destinations"
      title={`Edit destination ${id}`}
      description="This route is ready for the destination edit form."
    />
  );
}
