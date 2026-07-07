import RouteShell from "@/src/shared/components/RouteShell";

export default async function AdminTourismServiceEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RouteShell
      eyebrow="Admin services"
      title={`Edit tourism service ${id}`}
      description="This route is ready for the tourism service edit form."
    />
  );
}
