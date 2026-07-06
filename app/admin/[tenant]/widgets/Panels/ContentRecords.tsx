"use client";

import ContentPanel from "./Content";

export default function ContentRecordsPanel({
  tenant,
  selectedStudioSchemaId,
  onSelectStudioSchema,
  selectedContentSchemaId,
}: {
  tenant: string;
  selectedStudioSchemaId: number | null;
  onSelectStudioSchema: (schemaId: number | null) => void;
  selectedContentSchemaId: number | null;
}) {
  return (
    <ContentPanel
      tenant={tenant}
      selectedStudioSchemaId={selectedStudioSchemaId}
      onSelectStudioSchema={onSelectStudioSchema}
      selectedSchemaId={selectedContentSchemaId}
      mode="records"
    />
  );
}
