import React, { useEffect, useMemo, useState } from "react";
import { Trash2Icon } from "lucide-react";
import { TableGroup } from "../Content";
import { table } from "console";

export default function Schema({
  group,
  onDelete,
  onUpdateStatus,
}: {
  group: TableGroup;
  onDelete: (schemaId: number) => Promise<void> | void;
  onUpdateStatus: (schemaId: number, status: string) => Promise<void> | void;
}) {
  const [selectedVersion, setSelectedVersion] = useState(
    group.tables[0]?.version ?? "",
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<string | undefined>(group.tables[0]?.status);

  useEffect(() => {
    setSelectedVersion(group.tables[0]?.version ?? "");
  }, [group]);

  const selectedTable = useMemo(() => {
    setStatus(group.tables.find((table) => table.version === selectedVersion)?.status);
    return (
      group.tables.find((table) => table.version === selectedVersion) ??
      group.tables[0]
    );
  }, [group.tables, selectedVersion]);

  const expectedName = selectedTable?.name ?? "";
  const canConfirmDelete = deleteInput.trim() === expectedName;

  const openDeleteModal = () => {
    setDeleteInput("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) return;
    setDeleteInput("");
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTable || !canConfirmDelete) return;

    try {
      setIsDeleting(true);
      await onDelete(selectedTable.id);
      setShowDeleteModal(false);
      setDeleteInput("");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!selectedTable) return null;

  return (
    <>
      <div className="w-full p-3 rounded-xl border">
        <div className="w-full flex items-center justify-between gap-3 flex-wrap">
          <h3 className="text-sm font-medium font-mono">
            {group.name}{" "}
            <span className="text-fg/50 font-sans">({group.menu})</span>
          </h3>

          <div className="flex items-center gap-2">
            <select 
              value={status}
              onChange={(e) => {
                const value = e.target.value;
                setStatus(value);
                onUpdateStatus(selectedTable.id, value);
              }}
              className={`rounded-md border px-2 py-1 text-sm focus:outline-accent`}
            >
              <option value="enabled">enabled</option>
              <option value="disabled">disabled</option>
            </select>
            <select
              value={selectedVersion}
              onChange={(e) => setSelectedVersion(e.target.value)}
              className="rounded-md border px-2 py-1 text-sm focus:outline-accent"
            >
              {group.tables.map((table) => (
                <option key={table.id} value={table.version}>
                  {table.version}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={openDeleteModal}
              className="p-1.5 rounded-md text-danger hover:bg-danger hover:text-hover_text"
            >
              <Trash2Icon size={20} />
            </button>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-md border">
          <table className="min-w-full text-sm">
            <thead className="bg-accent text-left text-fg">
              <tr>
                {selectedTable.columns.map((column) => (
                  <th key={column.id} className="px-4 py-3 font-semibold text-left">
                    {column.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-accent">
              <tr className="transition hover:bg-hover/10">
                {selectedTable.columns.map((column) => (
                  <td
                    key={column.id}
                    className="px-4 py-2 font-medium text-fg/70 border"
                  >
                    {column.type === "String" ? (
                      <>{column.default || "Abcd"}</>
                    ) : column.type === "Integer" ? (
                      100
                    ) : column.type === "Float" ? (
                      100.45
                    ) : column.type === "Decimal" ? (
                      <>
                        {typeof column.precision === "number"
                          ? column.precision.toFixed(
                              typeof column.scale === "number"
                                ? column.scale
                                : 0,
                            )
                          : ""}
                      </>
                    ) : column.type === "Enum" ? (
                      <div className="flex flex-wrap gap-2">
                        {column.enumValues.map((enm, id) => (
                          <span
                            key={id}
                            className="bg-info px-2 py-1.5 rounded-md text-sm font-medium text-hover_text"
                          >
                            {enm}
                          </span>
                        ))}
                      </div>
                    ) : column.type === "Date" ? (
                      new Date().getDate()
                    ) : column.type === "DateTime" ? (
                    (new Date().toISOString().replace('T', ' ')).replace(/\.\d+Z$/, "")
                    ) : null}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-title">
                  Delete schema version
                </h2>
                <p className="mt-1 text-sm text-fg/70">
                  This will delete version{" "}
                  <span className="font-medium">{selectedTable.version}</span>{" "}
                  of table{" "}
                  <span className="font-semibold">{selectedTable.name}</span>.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-fg/80">
              To confirm, type{" "}
              <span className="font-semibold font-mono">
                {selectedTable.name}
              </span>{" "}
              below.
            </div>

            <div className="mt-4">
              <label
                htmlFor={`delete-${selectedTable.id}`}
                className="block text-sm font-medium"
              >
                Table name
              </label>
              <input
                id={`delete-${selectedTable.id}`}
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder={selectedTable.name}
                autoFocus
                className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-accent"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="rounded-md border px-4 py-2 text-sm font-medium"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={!canConfirmDelete || isDeleting}
                className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-hover_text disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}