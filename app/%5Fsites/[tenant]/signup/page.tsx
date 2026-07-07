import TenantCustomerAuthPage from "../TenantCustomerAuthPage";

type Props = {
  params: Promise<{
    tenant: string;
  }>;
};

export default async function SignUpPage({ params }: Props) {
  const resolvedParams = await params;

  return <TenantCustomerAuthPage tenant={resolvedParams.tenant} mode="signup" />;
}
