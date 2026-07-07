import RouteShell from "@/src/shared/components/RouteShell";

export default async function AdminPackageEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RouteShell
      eyebrow="Admin packages"
      title={`Edit package ${id}`}
      description="This route is ready for the package edit form."
    />
  );
}
