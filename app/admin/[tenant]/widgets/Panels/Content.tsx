"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FaCode,
  FaDatabase,
  FaEye,
  FaEyeSlash,
  FaPlus,
  FaRotateRight,
  FaTrash,
  FaXmark,
} from "react-icons/fa6";

import { useSchema } from "@/src/api/hooks/content/useSchema";
import { useMedia } from "@/src/api/hooks/media/useMedia";
import {
  createContentData,
  deleteContentData,
  getContentDataSources,
  getContentData,
  updateContentData,
} from "@/src/api/routes/content/data";
import {
  createSchema,
  deleteSchema,
  updateSchema,
} from "@/src/api/routes/content/schema";

type SchemaField = {
  id: string;
  name: string;
  label: string;
  type: "string" | "text" | "int" | "bool" | "decimal" | "asset" | "url";
  visible: boolean;
  required: boolean;
  placeholder?: string;
};

type SchemaBlueprint = {
  columns: SchemaField[];
  meta?: Record<string, unknown>;
};

type SchemaRow = {
  id: number;
  name?: string;
  menu?: string;
  source_key?: string | null;
  version?: string;
  status?: string;
  schema?: string | SchemaBlueprint | null;
};

type ContentRecord = {
  id: number;
  content_schema_id?: number;
  schema_id?: number;
  data?: Record<string, unknown> | unknown[];
  children?: ContentRecordChild[];
  created_at?: string;
  updated_at?: string;
};

type ContentRecordChild = {
  id?: number;
  source_key?: string | null;
  row_key?: string | null;
  sort_order?: number;
  payload?: Record<string, unknown> | unknown[] | null;
  data?: Record<string, unknown> | unknown[] | null;
  fields?: Array<{
    field_key?: string;
    source_column?: string;
    field_type?: string;
    value_string?: string | null;
    value_text?: string | null;
    value_int?: number | null;
    value_bool?: boolean | null;
    value_decimal?: number | null;
    value_asset_id?: number | null;
  }>;
};

type ContentDraft = {
  data: Record<string, unknown>;
  children: Array<Record<string, unknown>>;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
};

type JsonModalState = {
  open: boolean;
  title: string;
  kind: "schema" | "record";
  value: string;
};

type DataSourceOption = {
  sourceKey: string;
  label: string;
  fieldCount: number;
  recordCount: number;
  sampleFields: SchemaField[];
};

type ContentDataSourceField = {
  field_key: string;
  source_column?: string | null;
  field_type?: string | null;
  visible?: boolean;
  required?: boolean;
  sample_value?: unknown;
};

type ContentDataSource = {
  source_key: string;
  label: string;
  content_data_count: number;
  row_count: number;
  field_count: number;
  schema_blueprint?: string | Record<string, unknown> | null;
  sample_row_key?: string | null;
  fields: ContentDataSourceField[];
};

type ContentTableRow = {
  id: string;
  parentRecordId: number;
  childId: number | null;
  sourceKey: string;
  rowKey: string;
  values: Record<string, unknown>;
  parentRecord: ContentRecord;
  child?: ContentRecordChild;
};

const FIELD_TYPES: SchemaField["type"][] = [
  "string",
  "text",
  "int",
  "bool",
  "decimal",
  "asset",
  "url",
];

let fieldIdSeed = 0;

function createFieldId() {
  fieldIdSeed += 1;
  return `field_${fieldIdSeed}`;
}

const DEFAULT_BLUEPRINT: SchemaBlueprint = {
  columns: [
    {
      id: "0001",
      name: "Destination",
      label: "destination",
      type: "string",
      visible: true,
      required: false,
      placeholder: "",
    },
  ],
  meta: {
    kind: "content_schema",
    blueprintVersion: 1,
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(error: unknown, fallback: string) {
  const typedError = error as ApiError;
  return typedError?.response?.data?.message ?? typedError?.message ?? fallback;
}

function humanize(value: string) {
  if (value === "asset") return "Image";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function prettyJson(value: unknown, fallback: string) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
}

function safeJsonParse<T>(raw: string, fallback: T): T {
  if (!raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function normalizeField(
  raw: string | Partial<SchemaField> | Record<string, unknown>,
  index: number,
): SchemaField {
  if (typeof raw === "string") {
    return {
      id: createFieldId(),
      name: raw,
      label: humanize(raw),
      type: "string",
      visible: true,
      required: false,
      placeholder: "",
    };
  }

  const rawRecord = raw as Record<string, unknown>;
  const nameCandidate =
    typeof raw.name === "string" && raw.name.trim()
      ? raw.name.trim()
      : typeof rawRecord.key === "string" && rawRecord.key.trim()
        ? rawRecord.key.trim()
        : `field_${index + 1}`;

  const type = FIELD_TYPES.includes(raw.type as SchemaField["type"])
    ? (raw.type as SchemaField["type"])
    : "string";

  return {
    id: createFieldId(),
    name: nameCandidate,
    label: typeof raw.label === "string" && raw.label.trim() ? raw.label.trim() : humanize(nameCandidate),
    type,
    visible: typeof raw.visible === "boolean" ? raw.visible : true,
    required: typeof raw.required === "boolean" ? raw.required : false,
    placeholder:
      typeof raw.placeholder === "string" && raw.placeholder.trim() ? raw.placeholder.trim() : "",
  };
}

function fieldTypeFromValue(value: unknown): SchemaField["type"] {
  if (typeof value === "boolean") return "bool";
  if (typeof value === "number") return Number.isInteger(value) ? "int" : "decimal";
  if (typeof value === "string") return "string";
  return "text";
}

function fieldTypeFromPayload(fieldType?: string | null, value?: unknown): SchemaField["type"] {
  const normalized = fieldType?.toLowerCase();
  if (normalized === "bool" || normalized === "boolean") return "bool";
  if (normalized === "int" || normalized === "integer") return "int";
  if (normalized === "decimal" || normalized === "float" || normalized === "number") return "decimal";
  if (normalized === "asset" || normalized === "image") return "asset";
  if (normalized === "url") return "url";
  if (normalized === "text") return "text";
  return fieldTypeFromValue(value);
}

function normalizeBlueprint(schema?: string | SchemaBlueprint | null): SchemaBlueprint {
  if (!schema) return DEFAULT_BLUEPRINT;

  try {
    const parsed = typeof schema === "string" ? JSON.parse(schema) : schema;
    const columns = Array.isArray((parsed as SchemaBlueprint).columns)
      ? (parsed as SchemaBlueprint).columns.map((column, index) => normalizeField(column, index))
      : DEFAULT_BLUEPRINT.columns;

    return {
      ...(isRecord(parsed) ? parsed : {}),
      columns,
    } as SchemaBlueprint;
  } catch {
    return DEFAULT_BLUEPRINT;
  }
}

function emptyFieldValue(field: SchemaField): unknown {
  switch (field.type) {
    case "int":
    case "decimal":
      return "";
    case "bool":
      return false;
    default:
      return "";
  }
}

function buildDefaultDraft(schema?: SchemaRow | null): ContentDraft {
  const draft: Record<string, unknown> = {
    __meta: { visible: true },
  };

  schemaFields(schema).forEach((field) => {
    draft[field.name] = emptyFieldValue(field);
  });

  return { data: draft, children: [] };
}

function schemaFields(schema?: SchemaRow | null): SchemaField[] {
  return normalizeBlueprint(schema?.schema).columns.map((field, index) =>
    normalizeField(field, index),
  );
}

function schemaSourceKey(schema?: SchemaRow | null): string {
  if (typeof schema?.source_key === "string" && schema.source_key.trim()) {
    return schema.source_key.trim();
  }

  const blueprint = normalizeBlueprint(schema?.schema);
  const meta = isRecord(blueprint.meta) ? blueprint.meta : null;
  return typeof meta?.sourceKey === "string" ? meta.sourceKey : "";
}

function schemaDisplayName(schema?: SchemaRow | null): string {
  const sourceKey = typeof schema?.menu === "string" && schema.menu.trim()
    ? schema.menu.trim()
    : schemaSourceKey(schema);
  if (sourceKey) {
    return humanize(sourceKey);
  }

  return schema?.menu ?? schema?.name ?? "No table selected";
}

function sourceFieldsFromSummary(fields: ContentDataSourceField[] | undefined): SchemaField[] {
  return (fields ?? [])
    .map((field, index) =>
      normalizeField(
        {
          name: field.source_column?.trim() || field.field_key,
          label: humanize(field.source_column?.trim() || field.field_key),
          type: fieldTypeFromPayload(field.field_type, field.sample_value),
          visible: field.visible ?? true,
          required: field.required ?? false,
          placeholder: "",
        },
        index,
      ),
    )
    .filter((field) => !!field.name.trim());
}

function draftFromRecord(schema?: SchemaRow | null, record?: ContentRecord | null): ContentDraft {
  const source = isRecord(record?.data) ? record?.data : {};
  const draft: Record<string, unknown> = {
    ...source,
    __meta: {
      visible: true,
      ...(isRecord(source.__meta) ? source.__meta : {}),
    },
  };

  schemaFields(schema).forEach((field) => {
    if (!(field.name in draft)) {
      draft[field.name] = emptyFieldValue(field);
    }
  });

  return {
    data: draft,
    children: Array.isArray(record?.children) ? record?.children : [],
  };
}

function recordVisible(draft: ContentDraft): boolean {
  const meta = isRecord(draft.data.__meta) ? draft.data.__meta : null;
  return typeof meta?.visible === "boolean" ? meta.visible : true;
}

function setRecordVisible(draft: ContentDraft, visible: boolean): ContentDraft {
  return {
    ...draft,
    data: {
      ...draft.data,
      __meta: {
        ...(isRecord(draft.data.__meta) ? draft.data.__meta : {}),
        visible,
      },
    },
  };
}

function asString(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return prettyJson(value, "");
}

function childFieldValue(child: ContentRecordChild, fieldName: string): unknown {
  if (isRecord(child.data) && fieldName in child.data) {
    return child.data[fieldName];
  }

  if (isRecord(child.payload) && fieldName in child.payload) {
    return child.payload[fieldName];
  }

  return undefined;
}

function Modal({
  open,
  title,
  description,
  children,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-black/10 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4">
          <div>
            <h3 className="text-lg font-semibold text-[#182028]">{title}</h3>
            {description && <p className="text-sm text-black/55">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 p-2 text-black/60 hover:bg-black/5"
            aria-label="Close modal"
          >
            <FaXmark />
          </button>
        </div>
        <div className="max-h-[80vh] overflow-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function inputForType(
  field: SchemaField,
  value: unknown,
  onChange: (next: unknown) => void,
  mediaOptions: Array<{
    id: number;
    label?: string | null;
    original_name?: string | null;
    url?: string | null;
    secure_url?: string | null;
  }> = [],
) {
  const baseClass =
    "w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-[#1f3b4d]";

  if (field.type === "asset") {
    const selectedValue = asString(value);

    return (
      <div className="space-y-2">
        <select
          value={selectedValue}
          onChange={(event) => onChange(event.target.value)}
          className={baseClass}
        >
          <option value="">Select an image from media</option>
          {mediaOptions.map((media) => {
            const mediaValue = media.url ?? media.secure_url ?? "";
            const mediaLabel = media.label?.trim() || media.original_name?.trim() || `Media #${media.id}`;

            return (
              <option key={media.id} value={mediaValue}>
                {mediaLabel}
              </option>
            );
          })}
        </select>

        <input
          value={selectedValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Or paste an image URL"
          className={baseClass}
        />
      </div>
    );
  }

  if (field.type === "text") {
    return (
      <textarea
        value={asString(value)}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className={`${baseClass} min-h-24`}
      />
    );
  }

  if (field.type === "bool") {
    return (
      <label className="inline-flex items-center gap-2 text-sm text-black/70">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(event.target.checked)}
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "int" || field.type === "decimal") {
    return (
      <input
        type="number"
        value={asString(value)}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className={baseClass}
      />
    );
  }

  return (
    <input
      value={asString(value)}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.placeholder}
      className={baseClass}
    />
  );
}

export default function ContentPanel({
  tenant,
  selectedStudioSchemaId,
  onSelectStudioSchema,
  selectedSchemaId,
  mode = "records",
}: {
  tenant: string;
  selectedStudioSchemaId: number | null;
  onSelectStudioSchema: (schemaId: number | null) => void;
  selectedSchemaId: number | null;
  mode?: "studio" | "records";
}) {
  const tenantKey = tenant;
  const { schemas, handleGetAllSchema } = useSchema();
  const { media, handleGetAllMedia } = useMedia();

  const schemaRows = React.useMemo(
    () => (Array.isArray(schemas) ? (schemas as SchemaRow[]) : []),
    [schemas],
  );

  const schemaBrowserRows = React.useMemo(() => schemaRows, [schemaRows]);

  const [schemaDraft, setSchemaDraft] = React.useState({
    name: "",
    menu: "",
    version: "v1",
    status: "enabled" as "enabled" | "disabled",
    sourceKey: "",
  });
  const [schemaFieldsDraft, setSchemaFieldsDraft] = React.useState<SchemaField[]>(
    () => normalizeBlueprint(DEFAULT_BLUEPRINT).columns,
  );
  const [schemaSaving, setSchemaSaving] = React.useState(false);
  const [schemaError, setSchemaError] = React.useState<string | null>(null);
  const [dataSources, setDataSources] = React.useState<DataSourceOption[]>([]);
  const [dataSourcesLoading, setDataSourcesLoading] = React.useState(false);
  const [selectedDataSourceKey, setSelectedDataSourceKey] = React.useState<string | null>(null);
  const [sourceRefreshToken, setSourceRefreshToken] = React.useState(0);

  const [records, setRecords] = React.useState<ContentRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = React.useState<number | null>(null);
  const [recordDraft, setRecordDraft] = React.useState<ContentDraft>(() => buildDefaultDraft(null));
  const [recordSaving, setRecordSaving] = React.useState(false);
  const [recordError, setRecordError] = React.useState<string | null>(null);

  const [jsonModal, setJsonModal] = React.useState<JsonModalState>({
    open: false,
    title: "",
    kind: "schema",
    value: "",
  });

  const selectedSchema = React.useMemo(
    () => schemaRows.find((schema) => schema.id === selectedStudioSchemaId) ?? null,
    [schemaRows, selectedStudioSchemaId],
  );

  const selectedContentSchema = React.useMemo(
    () => schemaRows.find((schema) => schema.id === selectedSchemaId) ?? null,
    [schemaRows, selectedSchemaId],
  );

  const activeView = mode === "studio" ? ("schemas" as const) : ("records" as const);

  const selectedRecord = React.useMemo(
    () => records.find((record) => record.id === selectedRecordId) ?? null,
    [records, selectedRecordId],
  );

  const selectedDataSource = React.useMemo(
    () => dataSources.find((source) => source.sourceKey === selectedDataSourceKey) ?? null,
    [dataSources, selectedDataSourceKey],
  );

  const activeSchema = mode === "studio" ? selectedSchema : selectedContentSchema;

  const visibleFields = React.useMemo(
    () => schemaFieldsDraft.filter((field) => field.visible),
    [schemaFieldsDraft],
  );

  const tableFields = React.useMemo(
    () => {
      if (selectedDataSource?.sampleFields.length) {
        return selectedDataSource.sampleFields;
      }

      return visibleFields.length > 0 ? visibleFields : schemaFieldsDraft;
    },
    [schemaFieldsDraft, selectedDataSource, visibleFields],
  );

  const tableRows = React.useMemo(() => {
    const activeSourceKey = selectedDataSource?.sourceKey ?? null;

    if (!activeSourceKey) {
      return records.map((record) => ({
        id: `record-${record.id}`,
        parentRecordId: record.id,
        childId: null,
        sourceKey: activeSchema?.menu?.trim() || activeSchema?.name?.trim() || "",
        rowKey: "",
        values: isRecord(record.data) ? record.data : {},
        parentRecord: record,
      })) satisfies ContentTableRow[];
    }

    return records.flatMap((record): ContentTableRow[] => {
      const children = Array.isArray(record.children) ? record.children : [];
      const scopedChildren = activeSourceKey
        ? children.filter((child) => (child.source_key ?? "").trim() === activeSourceKey)
        : children;

      if (scopedChildren.length === 0) {
        if (activeSourceKey) {
          return [];
        }

        const row: ContentTableRow = {
          id: `record-${record.id}`,
          parentRecordId: record.id,
          childId: null,
          sourceKey: "",
          rowKey: "",
          values: isRecord(record.data) ? record.data : {},
          parentRecord: record,
        };

        return [row];
      }

      return scopedChildren.map((child, index): ContentTableRow => ({
        id: `record-${record.id}-child-${child.id ?? index}`,
        parentRecordId: record.id,
        childId: child.id ?? null,
        sourceKey: (child.source_key ?? "").trim(),
        rowKey: (child.row_key ?? "").trim(),
        values: isRecord(child.data)
          ? child.data
          : isRecord(child.payload)
            ? child.payload
            : {},
        parentRecord: record,
        child,
      }));
    });
  }, [activeSchema?.menu, activeSchema?.name, records, selectedDataSource]);

  React.useEffect(() => {
    if (!tenantKey) return;
    void handleGetAllSchema(tenantKey);
  }, [tenantKey, handleGetAllSchema]);

  React.useEffect(() => {
    if (!tenantKey) return;
    void handleGetAllMedia(tenantKey);
  }, [tenantKey, handleGetAllMedia]);

  React.useEffect(() => {
    if (schemaRows.length === 0) {
      onSelectStudioSchema(null);
      setSchemaDraft({
        name: "",
        menu: "",
        version: "v1",
        status: "enabled",
        sourceKey: "",
      });
      setSchemaFieldsDraft(normalizeBlueprint(DEFAULT_BLUEPRINT).columns);
      return;
    }

    if (schemaBrowserRows.length === 0) {
      onSelectStudioSchema(null);
      return;
    }

    if (selectedStudioSchemaId && schemaRows.some((schema) => schema.id === selectedStudioSchemaId)) {
      return;
    }

    onSelectStudioSchema(null);
  }, [onSelectStudioSchema, schemaBrowserRows, schemaRows, selectedStudioSchemaId]);

  React.useEffect(() => {
    const schemaForDraft = activeSchema;
    if (!schemaForDraft) return;

    setSchemaDraft({
      name: schemaForDraft.name ?? "",
      menu: schemaForDraft.menu ?? "",
      version: schemaForDraft.version ?? "v1",
      status: schemaForDraft.status === "enabled" ? "enabled" : "disabled",
      sourceKey: schemaSourceKey(schemaForDraft),
    });
    setSchemaFieldsDraft(schemaFields(schemaForDraft));
  }, [activeSchema]);

  React.useEffect(() => {
    setSelectedDataSourceKey(null);
    setSelectedRecordId(null);
  }, [activeSchema?.id, mode]);

  const loadRecords = React.useCallback(
    async (schemaId: number) => {
      if (!tenantKey) return;

      try {
        setRecordError(null);
        const response = await getContentData(tenantKey, schemaId);
        const payload = response?.data?.data;
        const nextRecords = Array.isArray(payload)
          ? (payload as ContentRecord[])
          : Array.isArray((payload as { data?: unknown } | null | undefined)?.data)
            ? ((payload as { data?: unknown }).data as ContentRecord[])
            : [];
        setRecords(nextRecords);
        setSelectedRecordId(nextRecords[0]?.id ?? null);
      } catch (error: unknown) {
        setRecords([]);
        setSelectedRecordId(null);
        setRecordError(getErrorMessage(error, "Failed to load records"));
      }
    },
    [tenantKey],
  );

  React.useEffect(() => {
    if (!selectedSchemaId) {
      setRecords([]);
      setSelectedRecordId(null);
      setRecordDraft(buildDefaultDraft(null));
      return;
    }

    void loadRecords(selectedSchemaId);
  }, [loadRecords, selectedSchemaId]);

  React.useEffect(() => {
    let alive = true;

    const loadSources = async () => {
      if (!tenantKey) {
        setDataSources([]);
        return;
      }

      setDataSourcesLoading(true);
      try {
        const response = await getContentDataSources(tenantKey);
        const payload = response?.data?.data;
        const nextSources = Array.isArray(payload)
          ? (payload as ContentDataSource[]).map((source) => ({
              sourceKey: source.source_key,
              label: source.label || humanize(source.source_key),
              fieldCount: source.field_count ?? 0,
              recordCount: source.content_data_count ?? 0,
              sampleFields: sourceFieldsFromSummary(source.fields),
            }))
          : [];

        if (alive) {
          setDataSources(nextSources);
        }

      } catch {
        if (alive) {
          setDataSources([]);
        }
      } finally {
        if (alive) {
          setDataSourcesLoading(false);
        }
      }
    };

    void loadSources();

    return () => {
      alive = false;
    };
  }, [tenantKey, sourceRefreshToken]);

  React.useEffect(() => {
    if (dataSources.length === 0) {
      setSelectedDataSourceKey(null);
      return;
    }

    if (selectedDataSourceKey && dataSources.some((source) => source.sourceKey === selectedDataSourceKey)) {
      return;
    }

    setSelectedDataSourceKey(dataSources[0].sourceKey);
  }, [dataSources, selectedDataSourceKey]);

  React.useEffect(() => {
    if (!selectedContentSchema) return;
    if (!selectedRecord) {
      setRecordDraft(buildDefaultDraft(selectedContentSchema));
      return;
    }

    setRecordDraft(draftFromRecord(selectedContentSchema, selectedRecord));
  }, [selectedContentSchema, selectedRecord]);

  const updateField = (index: number, patch: Partial<SchemaField>) => {
    setSchemaFieldsDraft((current) =>
      current.map((field, fieldIndex) => (fieldIndex === index ? { ...field, ...patch } : field)),
    );
  };

  const addField = () => {
    const nextIndex = schemaFieldsDraft.length + 1;
    setSchemaFieldsDraft((current) => [
      ...current,
      {
        id: createFieldId(),
        name: `field_${nextIndex}`,
        label: `Field ${nextIndex}`,
        type: "string",
        visible: true,
        required: false,
        placeholder: "",
      },
    ]);
  };

  const removeField = (index: number) => {
    setSchemaFieldsDraft((current) => current.filter((_, fieldIndex) => fieldIndex !== index));
  };

  const applySourceBlueprint = (sourceKey: string) => {
    const source = dataSources.find((item) => item.sourceKey === sourceKey);
    if (!source) return;

    setSchemaDraft((current) => ({
      ...current,
      sourceKey: source.sourceKey,
      name: current.name.trim() || humanize(source.sourceKey),
      menu: source.sourceKey,
    }));

    if (source.sampleFields.length > 0) {
      setSchemaFieldsDraft(source.sampleFields);
    }
  };

  const openSchemaJson = () => {
    setJsonModal({
      open: true,
      title: "Schema JSON",
      kind: "schema",
      value: prettyJson(
        {
          ...normalizeBlueprint({
            columns: schemaFieldsDraft,
            meta: { kind: "content_schema", blueprintVersion: 1 },
          }),
        },
        "{}",
      ),
    });
  };

  const openRecordJson = (record?: ContentRecord | null) => {
    const nextDraft = record
      ? draftFromRecord(selectedContentSchema, record)
      : buildDefaultDraft(selectedContentSchema);

    setSelectedRecordId(record?.id ?? null);
    setRecordDraft(nextDraft);
    setJsonModal({
      open: true,
      title: record ? `Edit record #${record.id}` : "Create record",
      kind: "record",
      value: prettyJson(nextDraft, "{}"),
    });
  };

  const applyJsonModal = async () => {
    if (jsonModal.kind === "schema") {
      const parsed = safeJsonParse<unknown>(jsonModal.value, null);
      const blueprint =
        Array.isArray(parsed)
          ? { columns: parsed }
          : isRecord(parsed) && Array.isArray(parsed.columns)
            ? parsed
            : DEFAULT_BLUEPRINT;

      setSchemaFieldsDraft(
        (Array.isArray((blueprint as SchemaBlueprint).columns)
          ? (blueprint as SchemaBlueprint).columns
          : DEFAULT_BLUEPRINT.columns
        ).map((field, index) => normalizeField(field, index)),
      );
      setJsonModal((current) => ({ ...current, open: false }));
      return;
    }

    if (!selectedContentSchema) return;

    try {
      setRecordSaving(true);

      if (selectedRecord) {
        await updateContentData(selectedRecord.id, {
          tenantKey,
          content_schema_id: selectedContentSchema.id,
          data: recordDraft.data,
          children: recordDraft.children,
        });
      } else {
        await createContentData({
          tenantKey,
          content_schema_id: selectedContentSchema.id,
          data: recordDraft.data,
          children: recordDraft.children,
        });
      }

      await loadRecords(selectedContentSchema.id);
      setSourceRefreshToken((value) => value + 1);
      setJsonModal((current) => ({ ...current, open: false }));
    } catch (error: unknown) {
      setRecordError(getErrorMessage(error, "Failed to save record"));
    } finally {
      setRecordSaving(false);
    }
  };

  const saveSchema = async () => {
    if (!tenantKey) return;
    setSchemaSaving(true);
    setSchemaError(null);

    try {
      const normalizedSourceKey = schemaDraft.sourceKey.trim();
      const normalizedMenu = normalizedSourceKey || schemaDraft.menu.trim();

      if (!schemaDraft.name.trim() || !normalizedMenu) {
        throw new Error("Schema name and menu are required.");
      }

      const payload = {
        tenantKey,
        name: schemaDraft.name.trim(),
        menu: normalizedMenu,
        version: schemaDraft.version.trim() || "v1",
        status: schemaDraft.status,
        schema: prettyJson(
          normalizeBlueprint({
            columns: schemaFieldsDraft,
            meta: {
              kind: "content_schema",
              blueprintVersion: 1,
              sourceKey: normalizedMenu || undefined,
            },
          }),
          "{}",
        ),
      };

      if (selectedSchema) {
        await updateSchema(payload, selectedSchema.id);
      } else {
        await createSchema(payload);
      }

      await handleGetAllSchema(tenantKey);
    } catch (error: unknown) {
      setSchemaError(getErrorMessage(error, "Failed to save schema"));
    } finally {
      setSchemaSaving(false);
    }
  };

  const deleteSelectedSchema = async () => {
    if (!tenantKey || !selectedSchema) return;
    if (!window.confirm("Delete this schema? Existing records stay in the database.")) return;

    try {
      setSchemaSaving(true);
      await deleteSchema(tenantKey, selectedSchema.id);
      await handleGetAllSchema(tenantKey);
      onSelectStudioSchema(null);
      setRecords([]);
      setSelectedRecordId(null);
    } catch (error: unknown) {
      setSchemaError(getErrorMessage(error, "Failed to delete schema"));
    } finally {
      setSchemaSaving(false);
    }
  };

  const startNewSchema = () => {
    onSelectStudioSchema(null);
    setSchemaDraft({
      name: "",
      menu: "",
      version: "v1",
      status: "enabled",
      sourceKey: "",
    });
    setSchemaFieldsDraft(normalizeBlueprint(DEFAULT_BLUEPRINT).columns);
  };

  const saveRecord = async () => {
    if (!tenantKey || !selectedContentSchema) return;

    setRecordSaving(true);
    setRecordError(null);

    try {
      const payload = {
        tenantKey,
        content_schema_id: selectedContentSchema.id,
        data: recordDraft.data,
        children: recordDraft.children,
      };

      if (selectedRecord) {
        await updateContentData(selectedRecord.id, payload);
      } else {
        await createContentData(payload);
      }

      await loadRecords(selectedContentSchema.id);
      setSourceRefreshToken((value) => value + 1);
    } catch (error: unknown) {
      setRecordError(getErrorMessage(error, "Failed to save record"));
    } finally {
      setRecordSaving(false);
    }
  };

  const deleteSelectedRecord = async () => {
    if (!tenantKey || !selectedRecord) return;
    if (!window.confirm("Delete this content record?")) return;

    try {
      setRecordSaving(true);
      await deleteContentData(tenantKey, selectedRecord.id);
      await loadRecords(selectedContentSchema?.id ?? 0);
      setSelectedRecordId(null);
      setRecordDraft(buildDefaultDraft(selectedContentSchema));
      setSourceRefreshToken((value) => value + 1);
    } catch (error: unknown) {
      setRecordError(getErrorMessage(error, "Failed to delete record"));
    } finally {
      setRecordSaving(false);
    }
  };

  const updateRecordField = (fieldName: string, value: unknown) => {
    setRecordDraft((current) => ({
      ...current,
      data: {
        ...current.data,
        [fieldName]: value,
      },
    }));
  };

  const deleteRecordById = async (recordId: number) => {
    if (!tenantKey || !selectedContentSchema) return;

    try {
      setRecordSaving(true);
      await deleteContentData(tenantKey, recordId);
      await loadRecords(selectedContentSchema.id);
      if (selectedRecordId === recordId) {
        setSelectedRecordId(null);
        setRecordDraft(buildDefaultDraft(selectedContentSchema));
      }
      setSourceRefreshToken((value) => value + 1);
    } catch (error: unknown) {
      setRecordError(getErrorMessage(error, "Failed to delete record"));
    } finally {
      setRecordSaving(false);
    }
  };

  const toggleRecordVisibilityForRecord = async (record: ContentRecord) => {
    if (!tenantKey || !selectedContentSchema) return;

    const draft = draftFromRecord(selectedContentSchema, record);
    const nextDraft = setRecordVisible(draft, !recordVisible(draft));

    setSelectedRecordId(record.id);
    setRecordDraft(nextDraft);

    await updateContentData(record.id, {
      tenantKey,
      content_schema_id: selectedContentSchema.id,
      data: nextDraft.data,
      children: nextDraft.children,
    });
  };

  const selectedSchemaMenuTitle = schemaDisplayName(activeSchema);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbff_0%,#e8f2ff_100%)] text-fg">
      <div className="border-b border-blue-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-5 py-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[#4d76a8]">
              <FaDatabase className="text-[11px]" />
              Content Studio
            </div>
            <p className="max-w-3xl text-sm leading-6 text-black/60">
              Manage records for the selected datasource here.
            </p>
          </div>

        </div>
      </div>

      <div className="mx-auto max-w-[1600px] p-5">
        {activeView === "schemas" ? (
          <div className="grid gap-5 xl:grid-cols-[minmax(300px,30%)_minmax(0,70%)]">
            <aside className="space-y-4 rounded-3xl border border-blue-100 bg-white/90 p-4 shadow-[0_12px_40px_rgba(30,90,168,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-[#163a63]">Content schemas</h3>
                  <p className="text-xs text-black/55">
                    {schemaBrowserRows.length} schema(s) available
                  </p>
                </div>
                <button
                  type="button"
                  onClick={startNewSchema}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1e5aa8] px-3 py-2 text-xs font-semibold text-white hover:bg-[#174a8b]"
                >
                  <FaPlus className="text-[10px]" />
                  + New schema
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-blue-100">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="bg-[#eaf2ff] text-[11px] uppercase tracking-[0.18em] text-[#5d7fa8]">
                    <tr>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schemaBrowserRows.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="px-3 py-4 text-sm text-black/55">
                          No content schemas yet.
                        </td>
                      </tr>
                    ) : (
                      schemaBrowserRows.map((schema) => {
                        const active = schema.id === selectedSchemaId;
                        return (
                          <tr
                            key={schema.id}
                            className={[
                              "cursor-pointer border-t border-blue-100 transition-colors",
                              active ? "bg-[#1e5aa8] text-white" : "hover:bg-[#eef5ff]",
                            ].join(" ")}
                            onClick={() => {
                              onSelectStudioSchema(schema.id);
                            }}
                          >
                            <td className="px-3 py-3">
                              <div className="font-semibold">{schema.menu ?? schema.name ?? `Schema #${schema.id}`}</div>
                              <div className={active ? "text-xs text-white/75" : "text-xs text-black/45"}>
                                {schema.name ?? "-"} | {schema.version ?? "-"}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <span
                                className={[
                                  "rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
                                  schema.status === "enabled"
                                    ? active
                                      ? "bg-white/15 text-white"
                                      : "bg-emerald-50 text-emerald-700"
                                    : active
                                      ? "bg-white/15 text-white"
                                      : "bg-amber-50 text-amber-700",
                                ].join(" ")}
                              >
                                {schema.status ?? "disabled"}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-[#f4f8ff] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-[#163a63]">Datasources</h3>
                    <p className="text-xs text-black/55">
                      Built from `content_data_children.source_key` across tenant records.
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#4d76a8] ring-1 ring-blue-100">
                    {dataSourcesLoading ? "loading" : `${dataSources.length}`}
                  </span>
                </div>

                <div className="mt-3 overflow-hidden rounded-2xl border border-blue-100 bg-white">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-[#eaf2ff] text-[11px] uppercase tracking-[0.18em] text-[#5d7fa8]">
                      <tr>
                        <th className="px-3 py-3">Source</th>
                        <th className="px-3 py-3">Fields</th>
                        <th className="px-3 py-3">Use</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataSources.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="px-3 py-4 text-sm text-black/55">
                            No datasource found yet.
                          </td>
                        </tr>
                      ) : (
                        dataSources.map((source) => (
                          <tr key={source.sourceKey} className="border-t border-blue-100 align-top">
                            <td className="px-3 py-3">
                              <div className="font-semibold text-[#163a63]">{source.label}</div>
                              <div className="text-xs text-[#6f86a3]">{source.sourceKey}</div>
                            </td>
                            <td className="px-3 py-3 text-black/65">
                              {source.fieldCount} field(s), {source.recordCount} row(s)
                            </td>
                            <td className="px-3 py-3">
                              <button
                                type="button"
                                onClick={() => {
                                  onSelectStudioSchema(null);
                                  applySourceBlueprint(source.sourceKey);
                                }}
                                className="rounded-full border border-blue-100 px-3 py-2 text-xs font-semibold text-[#5a7597] hover:bg-[#eef5ff]"
                              >
                                Use
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </aside>

            <main className="space-y-5">
          {schemaError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {schemaError}
            </div>
          )}
          {recordError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {recordError}
            </div>
          )}

          {activeView === "schemas" ? (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="rounded-3xl border border-black/10 bg-white/90 shadow-[0_12px_40px_rgba(25,35,40,0.08)]"
            >
              <div className="flex flex-col gap-3 border-b border-black/10 px-5 py-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#16232f]">
                    {selectedSchema ? "Edit schema" : "Create schema"}
                  </h3>
                  <p className="text-sm text-black/55">
                    Save a tenant schema, then configure the field table below.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={openSchemaJson}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#5a7597] hover:bg-[#eef5ff]"
                  >
                    <FaCode className="text-xs" />
                    View JSON
                  </button>
                  <button
                    type="button"
                    onClick={deleteSelectedSchema}
                    disabled={!selectedSchema || schemaSaving}
                    className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#5a7597] hover:bg-[#eef5ff] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaTrash className="text-xs" />
                    Delete
                  </button>
                  <button
                    type="button"
                    onClick={saveSchema}
                    disabled={schemaSaving}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1f3b4d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#294d66] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaRotateRight className="text-xs" />
                    {schemaSaving ? "Saving..." : "Save schema"}
                  </button>
                </div>
              </div>

              <div className="space-y-5 px-5 py-5">
                <div className="rounded-2xl border border-black/10 bg-[#f8fbfc] p-4">
                  <h4 className="text-sm font-semibold text-[#16232f]">Schema details</h4>
                  <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,240px)_minmax(0,240px)]">
                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black/45">
                        Schema name
                      </span>
                      <input
                        value={schemaDraft.name}
                        onChange={(event) =>
                          setSchemaDraft((current) => ({ ...current, name: event.target.value }))
                        }
                        className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:border-[#1e5aa8]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black/45">
                        Menu label
                      </span>
                      <input
                        value={schemaDraft.menu}
                        onChange={(event) =>
                          setSchemaDraft((current) => ({ ...current, menu: event.target.value }))
                        }
                        className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:border-[#1e5aa8]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black/45">
                        Version
                      </span>
                      <input
                        value={schemaDraft.version}
                        onChange={(event) =>
                          setSchemaDraft((current) => ({ ...current, version: event.target.value }))
                        }
                        className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:border-[#1e5aa8]"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black/45">
                        Status
                      </span>
                      <select
                        value={schemaDraft.status}
                        onChange={(event) =>
                          setSchemaDraft((current) => ({
                            ...current,
                            status: event.target.value === "enabled" ? "enabled" : "disabled",
                          }))
                        }
                        className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm outline-none focus:border-[#1e5aa8]"
                      >
                        <option value="disabled">Disabled</option>
                        <option value="enabled">Enabled</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                    <div className="block">
                      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-black/45">
                        Source datasource
                      </span>
                      <div className="rounded-xl border border-blue-100 bg-white p-2">
                        {dataSources.length === 0 ? (
                          <p className="px-2 py-2 text-xs text-black/45">
                            No datasource metadata available.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {dataSources.map((source) => {
                              const active = source.sourceKey === schemaDraft.sourceKey;
                              return (
                                <button
                                  key={source.sourceKey}
                                  type="button"
                                  onClick={() => applySourceBlueprint(source.sourceKey)}
                                  className={[
                                    "rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
                                    active
                                      ? "border-[#1e5aa8] bg-[#1e5aa8] text-white"
                                      : "border-blue-100 bg-[#f7fbff] text-[#5a7597] hover:bg-[#eef5ff]",
                                  ].join(" ")}
                                >
                                  {source.label} ({source.fieldCount})
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-[11px] text-black/45">
                        Selected: {schemaDraft.sourceKey || "None"}
                      </p>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => {
                          if (schemaDraft.sourceKey) {
                            applySourceBlueprint(schemaDraft.sourceKey);
                          }
                        }}
                        disabled={!schemaDraft.sourceKey}
                        className="w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black/65 hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reload columns
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#f7f4ee] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-[#16232f]">Field configuration</h4>
                      <p className="text-xs text-black/50">
                        Fields are stored inside the schema blueprint.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addField}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-semibold text-[#5a7597] ring-1 ring-blue-100 hover:bg-[#eef5ff]"
                    >
                      <FaPlus className="text-[10px]" />
                      Add field
                    </button>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-black/10 bg-white">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-black/5 text-[11px] uppercase tracking-[0.18em] text-black/45">
                        <tr>
                          <th className="px-3 py-3">Field</th>
                          <th className="px-3 py-3">Type</th>
                          <th className="px-3 py-3">Flags</th>
                          <th className="px-3 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schemaFieldsDraft.map((field, index) => (
                          <tr key={field.id} className="border-t border-black/10 align-top">
                            <td className="px-3 py-3">
                              <div className="space-y-2">
                                <input
                                  value={field.name}
                                  onChange={(event) => updateField(index, { name: event.target.value })}
                                  className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs outline-none focus:border-[#1e5aa8]"
                                  placeholder="field_key"
                                />
                                <input
                                  value={field.label}
                                  onChange={(event) => updateField(index, { label: event.target.value })}
                                  className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs outline-none focus:border-[#1e5aa8]"
                                  placeholder="Label"
                                />
                                <input
                                  value={field.placeholder ?? ""}
                                  onChange={(event) =>
                                    updateField(index, { placeholder: event.target.value })
                                  }
                                  className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs outline-none focus:border-[#1e5aa8]"
                                  placeholder="Placeholder"
                                />
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <select
                                value={field.type}
                                onChange={(event) =>
                                  updateField(index, {
                                    type: event.target.value as SchemaField["type"],
                                  })
                                }
                                className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-xs outline-none focus:border-[#1e5aa8]"
                              >
                                {FIELD_TYPES.map((type) => (
                                  <option key={type} value={type}>
                                    {humanize(type)}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-3">
                              <div className="space-y-2 text-xs text-black/65">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={field.visible}
                                    onChange={(event) =>
                                      updateField(index, { visible: event.target.checked })
                                    }
                                  />
                                  Visible
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={field.required}
                                    onChange={(event) =>
                                      updateField(index, { required: event.target.checked })
                                    }
                                  />
                                  Required
                                </label>
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <button
                                type="button"
                                onClick={() => removeField(index)}
                                className="inline-flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-black/60 hover:bg-black/5"
                              >
                                <FaTrash className="text-[10px]" />
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#16232f]">Schema overview</h4>
                    <p className="text-xs text-black/50">
                      {visibleFields.length} visible field(s) in the blueprint.
                    </p>
                  </div>
                    <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#5a7597]">
                      {selectedSchemaMenuTitle}
                    </span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-black/5 text-[11px] uppercase tracking-[0.18em] text-black/45">
                        <tr>
                          <th className="px-3 py-3">Field</th>
                          <th className="px-3 py-3">Type</th>
                          <th className="px-3 py-3">Visible</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schemaFieldsDraft.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-3 py-4 text-black/55">
                              No fields defined.
                            </td>
                          </tr>
                        ) : (
                          schemaFieldsDraft.map((field) => (
                          <tr key={field.id} className="border-t border-black/10">
                              <td className="px-3 py-3">
                                <div className="font-semibold text-[#16232f]">{field.label}</div>
                                <div className="text-xs text-black/45">{field.name}</div>
                              </td>
                              <td className="px-3 py-3 text-black/65">{humanize(field.type)}</td>
                              <td className="px-3 py-3">
                                <span
                                  className={[
                                    "rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-wide",
                                    field.visible
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-amber-50 text-amber-700",
                                  ].join(" ")}
                                >
                                  {field.visible ? "Visible" : "Hidden"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.section
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className=""
            >
              <div className="rounded-3xl border border-black/10 bg-white/90 p-4 shadow-[0_12px_40px_rgba(25,35,40,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#16232f]">Content table</h3>
                    <p className="text-sm text-black/55">
                      {selectedDataSource ? selectedDataSource.label : selectedSchemaMenuTitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      openRecordJson(null);
                    }}
                    disabled={!selectedContentSchema}
                    className="inline-flex items-center gap-2 rounded-full bg-[#164dbb] px-3 py-2 text-xs font-semibold text-white hover:bg-[#001efd] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <FaPlus className="text-[10px]" />
                    Add
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {dataSourcesLoading ? (
                    <span className="text-xs text-black/45">Loading tables...</span>
                  ) : (
                    dataSources.map((source) => {
                      const active = source.sourceKey === selectedDataSourceKey;
                      return (
                        <button
                          key={source.sourceKey}
                          type="button"
                          onClick={() => setSelectedDataSourceKey(source.sourceKey)}
                          className={[
                            "rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
                            active
                              ? "border-[#164dbb] bg-[#164dbb] text-white"
                              : "border-blue-100 bg-[#f7fbff] text-[#5a7597] hover:bg-[#eef5ff]",
                          ].join(" ")}
                        >
                          {source.label}
                          <span className="ml-2 opacity-75">({source.recordCount})</span>
                        </button>
                      );
                    })
                  )}
                </div>

                <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead className="bg-black/5 text-[11px] uppercase tracking-[0.18em] text-black/45">
                      <tr>
                        {tableFields.map((field) => (
                          <th key={field.id} className="px-3 py-3">
                            {field.label}
                          </th>
                        ))}
                        <th className="px-3 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.length === 0 ? (
                        <tr>
                          <td colSpan={tableFields.length + 1} className="px-3 py-4 text-black/55">
                            No rows for the selected table yet.
                          </td>
                        </tr>
                      ) : (
                        (tableRows as ContentTableRow[]).map((row) => {
                          const active = row.parentRecordId === selectedRecordId;
                          const draft = draftFromRecord(selectedContentSchema, row.parentRecord);
                          return (
                            <tr
                              key={row.id}
                              className={[
                                "cursor-pointer border-t border-black/10 transition-colors",
                                active ? "bg-[#ffff] text-black" : "hover:bg-black/5",
                              ].join(" ")}
                              onClick={() => {
                                setSelectedRecordId(row.parentRecordId);
                                setRecordDraft(draft);
                              }}
                            >
                              {tableFields.map((field) => (
                                <td key={`${row.id}-${field.name}`} className="px-3 py-3 align-top">
                                  {asString(
                                    row.values[field.name] ??
                                      row.values[field.label] ??
                                      (row.child ? childFieldValue(row.child, field.name) : undefined),
                                  ) || "—"}
                                </td>
                              ))}
                              <td className="px-3 py-3">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      openRecordJson(row.parentRecord);
                                    }}
                                    className="rounded-full border border-[#5a7597] bg-white px-3 py-2 text-xs font-semibold text-[#5a7597] hover:bg-[#eef5ff]"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      void toggleRecordVisibilityForRecord(row.parentRecord);
                                    }}
                                    className="rounded-full border border-[#5a7597] bg-white px-3 py-2 text-xs font-semibold text-[#5a7597] hover:bg-[#eef5ff]"
                                  >
                                    {recordVisible(draft) ? "Hide" : "Show"}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      void deleteRecordById(row.parentRecordId);
                                    }}
                                    className="rounded-full border border-[#f26666] bg-white px-3 py-2 text-xs font-semibold text-[#f26666] hover:bg-[#fae9e9]"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="hidden rounded-3xl border border-black/10 bg-white/90 shadow-[0_12px_40px_rgba(25,35,40,0.08)]">
                <div className="flex flex-col gap-3 border-b border-black/10 px-5 py-5 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#16232f]">
                      {selectedRecord ? `Edit record #${selectedRecord.id}` : "Create record"}
                    </h3>
                    <p className="text-sm text-black/55">
                      Edit the record as a table. JSON is available in a modal only.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openRecordJson(selectedRecord)}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#5a7597] hover:bg-[#eef5ff]"
                    >
                      <FaCode className="text-xs" />
                      View JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedRecord) {
                          void toggleRecordVisibilityForRecord(selectedRecord);
                        }
                      }}
                      disabled={!selectedContentSchema || !selectedRecord}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#5a7597] hover:bg-[#eef5ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {recordVisible(recordDraft) ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                      {recordVisible(recordDraft) ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={deleteSelectedRecord}
                      disabled={!selectedRecord || recordSaving}
                      className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#5a7597] hover:bg-[#eef5ff] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaTrash className="text-xs" />
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={saveRecord}
                      disabled={!selectedContentSchema || recordSaving}
                      className="inline-flex items-center gap-2 rounded-full bg-[#1f3b4d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#294d66] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaRotateRight className="text-xs" />
                      {recordSaving ? "Saving..." : "Save record"}
                    </button>
                  </div>
                </div>

                <div className="grid gap-5 px-5 py-5 xl:grid-cols-[minmax(0,1fr)_300px]">
                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-2xl border border-black/10">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead className="bg-black/5 text-[11px] uppercase tracking-[0.18em] text-black/45">
                          <tr>
                            <th className="px-3 py-3">Field</th>
                            <th className="px-3 py-3">Value</th>
                            <th className="px-3 py-3">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          {schemaFieldsDraft.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="px-3 py-4 text-black/55">
                                Pick or create a schema to edit fields here.
                              </td>
                            </tr>
                          ) : (
                            schemaFieldsDraft.map((field) => (
                          <tr key={field.id} className="border-t border-black/10 align-top">
                                <td className="px-3 py-3">
                                  <div className="font-semibold text-[#16232f]">{field.label}</div>
                                  <div className="text-xs text-black/45">{field.name}</div>
                                </td>
                                <td className="px-3 py-3">
                                  {inputForType(
                                    field,
                                    recordDraft.data[field.name],
                                    (next) => updateRecordField(field.name, next),
                                    media,
                                  )}
                                </td>
                                <td className="px-3 py-3 text-black/65">{humanize(field.type)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-2xl border border-black/10 bg-[#f8fbfc] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-[#16232f]">Children</h4>
                          <p className="text-xs text-black/50">
                            Nested child rows are edited in the JSON modal only.
                          </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black/55 ring-1 ring-black/10">
                          {recordDraft.children.length} item(s)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-black/10 bg-[#f7f4ee] p-4">
                      <h4 className="text-sm font-semibold text-[#16232f]">Record summary</h4>
                      <div className="mt-3 space-y-2 text-sm text-black/65">
                        <p>
                          <span className="font-semibold text-black/80">Schema:</span>{" "}
                          {selectedSchemaMenuTitle}
                        </p>
                        <p>
                          <span className="font-semibold text-black/80">Visible:</span>{" "}
                          {recordVisible(recordDraft) ? "Yes" : "No"}
                        </p>
                        <p>
                          <span className="font-semibold text-black/80">Record:</span>{" "}
                          {selectedRecord ? `#${selectedRecord.id}` : "New"}
                        </p>
                        <p>
                          <span className="font-semibold text-black/80">Fields:</span>{" "}
                          {schemaFieldsDraft.length}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-[#16232f]">Visible fields</h4>
                      <div className="mt-3 space-y-2">
                        {visibleFields.map((field) => (
                          <div
                            key={field.id}
                            className="rounded-xl border border-blue-100 bg-[#eef5ff] px-3 py-2"
                          >
                            <div className="text-sm font-semibold text-[#16232f]">{field.label}</div>
                            <div className="text-xs text-black/50">
                              {field.name} | {humanize(field.type)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
            </main>
          </div>
        ) : (
          <main className="space-y-5">
            {schemaError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {schemaError}
              </div>
            )}
            {recordError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {recordError}
              </div>
            )}

            {activeView === "records" && (
              <motion.section
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className=""
              >
                <div className="rounded-3xl border border-black/10 bg-white/90 p-4 shadow-[0_12px_40px_rgba(25,35,40,0.08)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-[#16232f]">Content table</h3>
                      <p className="text-sm text-black/55">
                        {selectedDataSource ? selectedDataSource.label : selectedSchemaMenuTitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        openRecordJson(null);
                      }}
                      disabled={!selectedContentSchema}
                      className="inline-flex items-center gap-2 rounded-full bg-[#164dbb] px-3 py-2 text-xs font-semibold text-white hover:bg-[#001efd] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaPlus className="text-[10px]" />
                      Add
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {dataSourcesLoading ? (
                      <span className="text-xs text-black/45">Loading tables...</span>
                    ) : (
                      dataSources.map((source) => {
                        const active = source.sourceKey === selectedDataSourceKey;
                        return (
                          <button
                            key={source.sourceKey}
                            type="button"
                            onClick={() => setSelectedDataSourceKey(source.sourceKey)}
                            className={[
                              "rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
                              active
                                ? "border-[#164dbb] bg-[#164dbb] text-white"
                                : "border-blue-100 bg-[#f7fbff] text-[#5a7597] hover:bg-[#eef5ff]",
                            ].join(" ")}
                          >
                            {source.label}
                            <span className="ml-2 opacity-75">({source.recordCount})</span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-black/10">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-black/5 text-[11px] uppercase tracking-[0.18em] text-black/45">
                        <tr>
                          {tableFields.map((field) => (
                            <th key={field.id} className="px-3 py-3">
                              {field.label}
                            </th>
                          ))}
                          <th className="px-3 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.length === 0 ? (
                          <tr>
                            <td colSpan={tableFields.length + 1} className="px-3 py-4 text-black/55">
                              No rows for the selected table yet.
                            </td>
                          </tr>
                        ) : (
                          (tableRows as ContentTableRow[]).map((row) => {
                            const active = row.parentRecordId === selectedRecordId;
                            const draft = draftFromRecord(selectedContentSchema, row.parentRecord);
                            return (
                              <tr
                                key={row.id}
                                className={[
                                  "cursor-pointer border-t border-black/10 transition-colors",
                                  active ? "bg-[#ffff] text-black" : "hover:bg-black/5",
                                ].join(" ")}
                                onClick={() => {
                                  setSelectedRecordId(row.parentRecordId);
                                  setRecordDraft(draft);
                                }}
                              >
                                {tableFields.map((field) => (
                                  <td key={`${row.id}-${field.name}`} className="px-3 py-3 align-top">
                                    {asString(
                                      row.values[field.name] ??
                                        row.values[field.label] ??
                                        (row.child ? childFieldValue(row.child, field.name) : undefined),
                                    ) || "—"}
                                  </td>
                                ))}
                                <td className="px-3 py-3">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        openRecordJson(row.parentRecord);
                                      }}
                                      className="rounded-full border border-[#5a7597] bg-white px-3 py-2 text-xs font-semibold text-[#5a7597] hover:bg-[#eef5ff]"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        void toggleRecordVisibilityForRecord(row.parentRecord);
                                      }}
                                      className="rounded-full border border-[#5a7597] bg-white px-3 py-2 text-xs font-semibold text-[#5a7597] hover:bg-[#eef5ff]"
                                    >
                                      {recordVisible(draft) ? "Hide" : "Show"}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        void deleteRecordById(row.parentRecordId);
                                      }}
                                      className="rounded-full border border-[#f26666] bg-white px-3 py-2 text-xs font-semibold text-[#f26666] hover:bg-[#fae9e9]"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.section>
            )}
          </main>
        )}
      </div>

      <AnimatePresence>
        {jsonModal.open && (
          <Modal
            open={jsonModal.open}
            title={jsonModal.title}
            description={jsonModal.kind === "record" ? "Fill the fields below to create or update a record." : "This view is hidden from the main UI and is only used when raw JSON editing is needed."}
            onClose={() => setJsonModal((current) => ({ ...current, open: false }))}
          >
            {jsonModal.kind === "record" ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {tableFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">
                        {field.label}
                      </label>
                      {inputForType(
                        field,
                        recordDraft.data[field.name],
                        (next) => updateRecordField(field.name, next),
                        media,
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setJsonModal((current) => ({ ...current, open: false }))}
                    className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#5a7597] hover:bg-[#eef5ff]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyJsonModal}
                    disabled={recordSaving}
                    className="rounded-full bg-[#1f3b4d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#294d66] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {recordSaving ? "Saving..." : "Save record"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={jsonModal.value}
                  onChange={(event) =>
                    setJsonModal((current) => ({ ...current, value: event.target.value }))
                  }
                  className="min-h-[420px] w-full rounded-2xl border border-black/10 bg-[#0f1720] p-4 font-mono text-xs leading-6 text-white outline-none"
                  spellCheck={false}
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setJsonModal((current) => ({ ...current, open: false }))}
                    className="rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-[#5a7597] hover:bg-[#eef5ff]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={applyJsonModal}
                    className="rounded-full bg-[#1f3b4d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#294d66]"
                  >
                    Apply JSON
                  </button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
