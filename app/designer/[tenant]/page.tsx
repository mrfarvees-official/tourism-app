import React from "react";

export default async function TenantSiteDesigner({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant } = await params;
  return <div>{tenant}</div>;
}
