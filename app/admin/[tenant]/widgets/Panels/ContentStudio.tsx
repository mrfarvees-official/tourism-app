"use client";

import ContentPanel from "./Content";

export default function ContentStudioPanel({
  tenant,
  selectedStudioSchemaId,
  onSelectStudioSchema,
}: {
  tenant: string;
  selectedStudioSchemaId: number | null;
  onSelectStudioSchema: (schemaId: number | null) => void;
}) {
  return (
    <ContentPanel
      tenant={tenant}
      selectedStudioSchemaId={selectedStudioSchemaId}
      onSelectStudioSchema={onSelectStudioSchema}
      selectedSchemaId={null}
      mode="studio"
    />
  );
}
