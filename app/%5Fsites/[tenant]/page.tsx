export default async function TenantHome({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return <div style={{ padding: 24 }}>Tenant: {tenant}</div>;
}
