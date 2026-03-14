import { useQueryState } from "@/src/utils/useParam";
import React, { useEffect, useState } from "react";
import { Trash2Icon } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { capitalizeWord, isJoinedWord } from "@/src/utils/string";
import { useSchema } from "@/src/api/hooks/content/useSchema";
import Schema from "./Content/Schema";

type ContentKey = "Create" | "Schema";

const contents = ["Create", "Schema"] as const;

export type ColumnType =
  | "Integer"
  | "Float"
  | "Decimal"
  | "String"
  | "Enum"
  | "Date"
  | "DateTime";

export const types: ColumnType[] = [
  "Integer",
  "Float",
  "Decimal",
  "String",
  "Enum",
  "Date",
  "DateTime",
];

export type ColumnItem = {
  id: any;
  order: number;
  name: string;
  primary: boolean;
  unique: boolean;
  type: ColumnType;
  length: number | "";
  default: string;
  nullable: boolean;
  enumValues: string[];
  precision: number | "";
  scale: number | "";
};

export type Table = {
  id: number;
  name: string;
  menu: string;
  version: string;
  status: string;
  columns: ColumnItem[];
};

export type TableGroup = {
  name: string;
  menu: string;
  tables: Table[];
};

const ContentItem = ({
  content,
  current,
  setSetting,
}: {
  content: ContentKey;
  current: ContentKey;
  setSetting: React.Dispatch<React.SetStateAction<ContentKey>>;
}) => {
  return (
    <button
      onClick={() => setSetting(content)}
      className={`text-nowrap px-4 py-2 text-fg ${
        current === content ? "border-b-[4px] font-semibold border-accent" : ""
      }`}
    >
      {content}
    </button>
  );
};

const createEmptyColumn = (id: number): ColumnItem => ({
  id: id,
  order: id,
  name: "",
  primary: false,
  unique: false,
  type: "String",
  length: "",
  default: "",
  nullable: false,
  enumValues: [],
  precision: "",
  scale: "",
});

type ColumnConfig = Omit<ColumnItem, "id" | "name">;

export default function ContentPanel() {
  const [tenantKey, setTenantKey] = useState<string | null>(null);
  const DEFAULT_CONTENT: ContentKey = "Create";

  const isContentKey = (v: string): v is ContentKey =>
    (contents as readonly string[]).includes(v);

  const [content, setContent] = useQueryState<ContentKey>("content", {
    defaultValue: DEFAULT_CONTENT,
    parse: (raw) => (raw && isContentKey(raw) ? raw : DEFAULT_CONTENT),
    serialize: (v) => (v === DEFAULT_CONTENT ? null : v),
  });

  const [canSubmit, setCanSubmit] = useState<boolean>(false);
  const [table, setTable] = useState<string>("");
  const [contentMenu, setContentMenu] = useState<string>("");
  const [version, setVersion] = useState<string>("v1.0");
  const [status, setStatus] = useState<string>("disabled");
  const [columns, setColumns] = useState<ColumnItem[]>([createEmptyColumn(1)]);
  const [tableError, setTableError] = useState<boolean>(false);
  const [enumInputs, setEnumInputs] = useState<Record<string, string>>({});

  const addColumn = () => {
    setColumns((prev) => [...prev, createEmptyColumn(columns.length + 1)]);
  };

  const removeColumn = (id: number) => {
    setColumns((prev) => prev.filter((col) => col.id !== id));
  };

  const updateColumn = <K extends keyof Omit<ColumnItem, "id">>(
    id: string,
    field: K,
    value: ColumnItem[K],
  ) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== id) return col;

        if (field === "primary") {
          const isPrimary = value as ColumnItem["primary"];

          return {
            ...col,
            primary: isPrimary,
            unique: isPrimary ? true : col.unique,
            nullable: isPrimary ? false : col.nullable,
          };
        }

        if (field === "nullable" && col.primary) {
          return {
            ...col,
            nullable: false,
          };
        }

        return { ...col, [field]: value };
      }),
    );
  };

  const handleTypeChange = (id: string, nextType: ColumnType) => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id !== id) return col;

        return {
          ...col,
          type: nextType,
          length: nextType === "String" ? col.length : "",
          enumValues: nextType === "Enum" ? col.enumValues : [],
          precision: nextType === "Decimal" ? col.precision : "",
          scale: nextType === "Decimal" ? col.scale : "",
        };
      }),
    );
  };

  const createPayload = () => {
    const columnsJson = {
      columns: columns.reduce<
        Record<string, Partial<ColumnConfig> & { order: number }>
      >((acc, { id, name, ...rest }, index) => {
        if (!name) return acc;

        acc[name] = {
          ...Object.fromEntries(
            Object.entries(rest).filter(([, v]) => {
              if (v === "") return false;
              if (Array.isArray(v) && v.length === 0) return false;
              return true;
            }),
          ),
          order: index,
        };

        return acc;
      }, {}),
    };

    return {
      table,
      menu: contentMenu,
      version,
      status,
      json: columnsJson,
    };
  };

  const reset = () => {
    setTable("");
    setContentMenu("");
    setVersion("v1.0");
    setColumns([createEmptyColumn(1)]);
  };

  const {
    loading,
    errors,
    result,
    schemas,
    handleCreateSchema,
    handleGetAllSchema,
    handleGetSchema,
    handleUpdateSchema,
    handleDeleteSchema,
  } = useSchema();

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast("Please complete all fields", { icon: "⚠️" });
      return;
    }
    const jsonData = createPayload();
    const payload = {
      tenantKey: tenantKey,
      name: jsonData.table,
      menu: jsonData.menu,
      schema: JSON.stringify(jsonData.json),
      version: jsonData.version,
      status: jsonData.status,
    };

    await handleCreateSchema(payload);

    if (!errors) {
      reset();
      toast.success(result?.data?.message ?? "Success");
    }
  };

  const mapSchemasToTables = (schemas: any[] = []): TableGroup[] => {
    if (!Array.isArray(schemas)) return [];

    const grouped = new Map<string, TableGroup>();

    schemas.forEach((item) => {
      let parsed: { columns?: Record<string, any> } = {};

      try {
        parsed =
          typeof item.schema === "string"
            ? JSON.parse(item.schema)
            : item.schema;
      } catch {
        parsed = {};
      }

      const columns: ColumnItem[] = Object.entries(parsed.columns ?? {}).map(
        ([name, value], index): ColumnItem => ({
          id: `${item.id}-${name}-${index}`,
          name,
          order: value.order,
          primary: value.primary ?? false,
          unique: value.unique ?? false,
          type: (value.type as ColumnType) ?? "String",
          length: value.length ?? "",
          default: value.default ?? "",
          nullable: value.nullable ?? false,
          enumValues: value.enumValues ?? [],
          precision: value.precision ?? "",
          scale: value.scale ?? "",
        }),
      );

      const table: Table = {
        id: item.id,
        name: item.name,
        menu: item.menu,
        version: item.version,
        status: item.status,
        columns,
      };

      const key = item.name;

      if (!grouped.has(key)) {
        grouped.set(key, {
          name: item.name,
          menu: item.menu,
          tables: [table],
        });
      } else {
        grouped.get(key)?.tables.push(table);
      }
    });

    return Array.from(grouped.values()).map((group) => ({
      ...group,
      tables: [...group.tables].sort((a, b) => {
        const aEnabled = a.status === "enabled" ? 1 : 0;
        const bEnabled = b.status === "enabled" ? 1 : 0;

        if (aEnabled !== bEnabled) {
          return bEnabled - aEnabled;
        }

        return b.version.localeCompare(a.version, undefined, { numeric: true });
      }),
    }));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathParts = window.location.pathname.split("/");
      const tenant = pathParts[2] ?? null;
      setTenantKey(tenant);
    }
  }, []);

  useEffect(() => {
    const hasTable = table.trim() !== "";
    const hasContentMenu = contentMenu.trim() !== "";
    const hasVersion = version.trim() !== "";
    const hasColumns = columns.length > 0;
    const allColumnsHaveName = columns.every(
      (column) => column.name.trim() !== "",
    );

    setCanSubmit(
      hasTable &&
        hasContentMenu &&
        hasVersion &&
        hasColumns &&
        allColumnsHaveName &&
        !tableError,
    );
  }, [table, contentMenu, version, columns, tableError]);

  useEffect(() => {
    if (tenantKey) {
      handleGetAllSchema(tenantKey);
    }
  }, [tenantKey, content]);

  const onUpdateSchemaStatus = async (schemaId: number, status: any) => {
    if (!tenantKey) return;

    try {
      const res = await handleUpdateSchema(
        { tenantKey: tenantKey, status: status },
        schemaId,
      );
      if (res && res.data) {
        toast.success(res.data.message ?? "Updated");
      } else {
        toast.success("Updated");
      }
      await handleGetAllSchema(tenantKey);
    } catch {
      toast.error("Failed to update schema");
    }
  };

  const onDeleteSchema = async (schemaId: number) => {
    if (!tenantKey) return;

    try {
      const res = await handleDeleteSchema(tenantKey, schemaId);
      if (res && res.data) {
        toast.success(res.data.message ?? "Deleted");
      } else {
        toast.success("Deleted");
      }
      await handleGetAllSchema(tenantKey);
    } catch {
      toast.error("Failed to delete schema");
    }
  };

  return (
    <div className="w-full min-h-screen bg-content p-5 flex flex-col">
      <Toaster position="top-right" />
      <div className="flex">
        <h2 className="text-2xl font-bold text-title">Content</h2>
      </div>

      <div className="w-full">
        <nav className="mt-1 overflow-x-auto whitespace-nowrap">
          <ul className="inline-flex items-start justify-start border-accent">
            {contents.map((key) => (
              <li key={key}>
                <ContentItem
                  content={key}
                  setSetting={setContent}
                  current={content}
                />
              </li>
            ))}
          </ul>
        </nav>

        <hr className="border-t-2" />

        <div className="mt-5">
          {content === "Create" ? (
            <form onSubmit={(e) => e.preventDefault()}>
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Create new table</h2>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="text-sm font-medium bg-accent text-hover_text px-3 py-1.5 rounded-md"
                  >
                    Create table
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 py-2">
                  <div className="flex flex-col">
                    <label htmlFor="table-name">Table Name</label>
                    <input
                      id="table-name"
                      type="text"
                      value={table ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        const valid = isJoinedWord(value);
                        setTableError(!valid);
                        setTable(value);
                        setContentMenu(capitalizeWord(value));
                      }}
                      placeholder="Table name"
                      className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                    />
                    {tableError && (
                      <p className="text-red-500 text-sm mt-1">
                        Table name must be joined. Use '-' or '_' instead of
                        spaces.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="menu-name">Content menu</label>
                    <input
                      id="menu-name"
                      type="text"
                      value={contentMenu ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setContentMenu(capitalizeWord(value));
                      }}
                      placeholder="Menu name"
                      className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor="table-version">Version</label>
                    <input
                      id="table-version"
                      type="text"
                      value={version}
                      onChange={(e) => {
                        const value = e.target.value;
                        setVersion(value);
                      }}
                      placeholder="Version"
                      className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label htmlFor={`status`}>Type</label>
                    <select
                      id={`status`}
                      value={status}
                      onChange={(e) => {
                        const value = e.target.value;
                        setStatus(value);
                      }}
                      className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                    >
                      <option value="enabled">enabled</option>
                      <option value="disabled">disabled</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h2 className="mt-2 font-semibold">
                      Create columns ({columns.length})
                    </h2>
                    <button
                      type="button"
                      onClick={addColumn}
                      className="rounded-md border px-3 py-1.5 text-sm font-medium text-fg/80 transition hover:bg-accent hover:text-hover_text"
                    >
                      + New column
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col gap-4">
                    {columns.map((column, idx) => (
                      <div
                        key={column.id}
                        className="rounded-xl border p-4 shadow-sm"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="font-medium">Column ({column.id})</h3>
                          {columns.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeColumn(column.id)}
                              className="text-sm text-danger hover:text-hover_text hover:bg-danger p-1 rounded-md"
                            >
                              <Trash2Icon size={20} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                          <div className="flex flex-col">
                            <label htmlFor={`name-${column.id}`}>Name</label>
                            <input
                              id={`name-${column.id}`}
                              type="text"
                              value={column.name}
                              onChange={(e) =>
                                updateColumn(column.id, "name", e.target.value)
                              }
                              placeholder="Column name"
                              className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                            />
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor={`type-${column.id}`}>Type</label>
                            <select
                              id={`type-${column.id}`}
                              value={column.type}
                              onChange={(e) =>
                                handleTypeChange(
                                  column.id,
                                  e.target.value as ColumnType,
                                )
                              }
                              className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                            >
                              {types.map((t) => (
                                <option key={t} value={t}>
                                  {t}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex flex-col">
                            <label htmlFor={`default-${column.id}`}>
                              Default
                            </label>
                            <input
                              id={`default-${column.id}`}
                              type="text"
                              value={column.default}
                              onChange={(e) =>
                                updateColumn(
                                  column.id,
                                  "default",
                                  e.target.value,
                                )
                              }
                              placeholder="Default value"
                              className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                            />
                          </div>

                          {column.type === "String" && (
                            <div className="flex flex-col">
                              <label htmlFor={`length-${column.id}`}>
                                Length
                              </label>
                              <input
                                id={`length-${column.id}`}
                                type="number"
                                min={0}
                                value={column.length}
                                onKeyDown={(e) => {
                                  if (e.key === "-") e.preventDefault();
                                }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  updateColumn(
                                    column.id,
                                    "length",
                                    value === ""
                                      ? ""
                                      : Math.max(0, parseInt(value, 10)),
                                  );
                                }}
                                placeholder="String length"
                                className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                              />
                            </div>
                          )}

                          {column.type === "Enum" && (
                            <div className="flex flex-col md:col-span-2">
                              <label htmlFor={`enum-${column.id}`}>
                                Enum values
                              </label>
                              <input
                                id={`enum-${column.id}`}
                                type="text"
                                value={
                                  enumInputs[column.id] ??
                                  column.enumValues.join(", ")
                                }
                                onChange={(e) => {
                                  const raw = e.target.value;

                                  setEnumInputs((prev) => ({
                                    ...prev,
                                    [column.id]: raw,
                                  }));

                                  const values = raw
                                    .split(",")
                                    .map((v) => v.trim())
                                    .filter(Boolean);

                                  updateColumn(column.id, "enumValues", values);
                                }}
                                placeholder="active, inactive, pending"
                                className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                              />
                            </div>
                          )}

                          {column.type === "Decimal" && (
                            <>
                              <div className="flex flex-col">
                                <label htmlFor={`precision-${column.id}`}>
                                  Precision
                                </label>
                                <input
                                  id={`precision-${column.id}`}
                                  type="number"
                                  min={0}
                                  value={column.precision}
                                  onKeyDown={(e) => {
                                    if (e.key === "-") e.preventDefault();
                                  }}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    updateColumn(
                                      column.id,
                                      "precision",
                                      value === ""
                                        ? ""
                                        : Math.max(0, parseInt(value, 10)),
                                    );
                                  }}
                                  placeholder="e.g. 10"
                                  className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                                />
                              </div>

                              <div className="flex flex-col">
                                <label htmlFor={`scale-${column.id}`}>
                                  Scale
                                </label>
                                <input
                                  id={`scale-${column.id}`}
                                  type="number"
                                  min={0}
                                  value={column.scale}
                                  onKeyDown={(e) => {
                                    if (e.key === "-") e.preventDefault();
                                  }}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    updateColumn(
                                      column.id,
                                      "scale",
                                      value === ""
                                        ? ""
                                        : Math.max(0, parseInt(value, 10)),
                                    );
                                  }}
                                  placeholder="e.g. 2"
                                  className="mt-1 rounded-md border px-2 py-1 focus:outline-accent"
                                />
                              </div>
                            </>
                          )}

                          <div className="flex items-center gap-4 md:col-span-4 flex-wrap">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={column.primary}
                                onChange={(e) =>
                                  updateColumn(
                                    column.id,
                                    "primary",
                                    e.target.checked,
                                  )
                                }
                                className="h-4 w-4 accent-accent"
                              />
                              Primary
                            </label>

                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={column.unique}
                                onChange={(e) =>
                                  updateColumn(
                                    column.id,
                                    "unique",
                                    e.target.checked,
                                  )
                                }
                                className="h-4 w-4 accent-accent"
                              />
                              Unique
                            </label>

                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={column.nullable}
                                disabled={column.primary}
                                onChange={(e) =>
                                  updateColumn(
                                    column.id,
                                    "nullable",
                                    e.target.checked,
                                  )
                                }
                                className="h-4 w-4 accent-accent"
                              />
                              Nullable
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          ) : null}

          {content === "Schema" ? (
            <div>
              <h2>All schemas ({schemas ? schemas.length : 0})</h2>
              <div className="flex flex-col gap-3 mt-3">
                {(mapSchemasToTables(schemas) ?? []).map((group) => (
                  <Schema
                    key={group.name}
                    group={group}
                    onDelete={onDeleteSchema}
                    onUpdateStatus={onUpdateSchemaStatus}
                  />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
