import AuthGuard from "@/src/app/AuthGuard";
import MainPanel from "./widgets/MainPanel";

export default async function TenantHome({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  
  return (
    <AuthGuard tenant={tenant}>
      <MainPanel />
    </AuthGuard>
  );
}
