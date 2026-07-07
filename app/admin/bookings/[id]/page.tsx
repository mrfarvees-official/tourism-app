import RouteShell from "@/src/shared/components/RouteShell";

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <RouteShell
      eyebrow="Admin bookings"
      title={`Booking ${id}`}
      description="This route is ready for booking status, payment status, travelers, and add-ons."
    />
  );
}
