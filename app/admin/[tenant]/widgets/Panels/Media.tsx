"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaArrowUpFromBracket,
  FaRegTrashCan,
  FaRegImage,
  FaLink,
  FaRotateRight,
} from "react-icons/fa6";
import { useMedia, type MediaItem } from "@/src/api/hooks/media/useMedia";

type Props = {
  tenant: string;
};

const formatBytes = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const power = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / 1024 ** power;

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[power]}`;
};

export default function MediaPanel({ tenant }: Props) {
  const [label, setLabel] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [status, setStatus] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const {
    media,
    loading,
    errors,
    handleGetAllMedia,
    handleUploadMedia,
    handleDeleteMedia,
  } = useMedia();

  const loadMedia = React.useCallback(async () => {
    if (!tenant) return;
    await handleGetAllMedia(tenant);
  }, [handleGetAllMedia, tenant]);

  React.useEffect(() => {
    void loadMedia();
  }, [loadMedia]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      setStatus("Choose an image before uploading.");
      return;
    }

    try {
      setStatus(null);

      await handleUploadMedia({
        tenantKey: tenant,
        label,
        file,
      });

      setLabel("");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadMedia();
      setStatus("Image uploaded.");
    } catch {
      setStatus("Upload failed.");
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (
      !window.confirm(
        "Delete this image from Cloudinary and the media library?",
      )
    ) {
      return;
    }

    try {
      await handleDeleteMedia(tenant, item.id);
      await loadMedia();
      setStatus("Image deleted.");
    } catch {
      setStatus("Delete failed.");
    }
  };

  const copyUrl = async (url?: string | null) => {
    if (!url) return;

    await navigator.clipboard.writeText(url);
    setStatus("Image URL copied.");
  };

  return (
    <div className="min-h-screen bg-white text-fg">
      <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8 lg:py-8">
        <div className="relative min-h-screen">
          {/* LEFT ABSOLUTE MEDIA PANEL */}
          <aside className="hidden xl:block xl:absolute xl:left-0 xl:top-0 xl:w-[300px]">
            <section className="rounded-2xl border border-border bg-bg p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-hover text-hover_text">
                  <FaRegImage />
                </div>

                <div className="min-w-0">
                  <h1 className="truncate text-xl font-semibold">
                    Media Library
                  </h1>
                  <p className="text-sm text-muted">
                    Upload, preview, and delete tenant images.
                  </p>
                </div>
              </div>

              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-fg">
                    Label
                  </span>

                  <input
                    value={label}
                    onChange={(event) => setLabel(event.target.value)}
                    className="w-full rounded-xl border border-border bg-input px-4 py-3 text-sm outline-none transition placeholder:text-muted focus:border-primary"
                    placeholder="hero-banner"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-fg">
                    Image file
                  </span>

                  <input
                    id="media-file"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setFile(event.target.files?.[0] ?? null)
                    }
                    className="block w-full rounded-xl border border-dashed border-border bg-input px-4 py-3 text-sm text-fg file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:border-primary"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <FaArrowUpFromBracket />
                  {loading ? "Uploading..." : "Upload image"}
                </button>

                <button
                  type="button"
                  onClick={() => void loadMedia()}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-bg px-4 py-3 text-sm font-semibold text-fg transition hover:bg-hover hover:text-hover_text"
                >
                  <FaRotateRight />
                  Refresh library
                </button>

                {status && <p className="text-sm text-success">{status}</p>}

                {errors?.length ? (
                  <p className="text-sm text-danger">{errors[0]}</p>
                ) : null}
              </form>
            </section>
          </aside>

          {/* MOBILE NORMAL MEDIA PANEL */}
          <aside className="mb-6 xl:hidden">
            <section className="rounded-2xl border border-border bg-bg p-5 shadow-sm">
              {/* same form content can stay here for mobile */}
            </section>
          </aside>

          {/* RIGHT IMAGE SECTION */}
          <section className="min-h-screen min-w-0 overflow-hidden xl:pl-[330px]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-semibold">Uploaded images</h2>
                <p className="text-sm text-muted">
                  {media.length} item(s) in the library
                </p>
              </div>

              <div className="hidden text-xs uppercase tracking-[0.3em] text-muted sm:block">
                Cloudinary
              </div>
            </div>
            <div className="h-screen overflow-y-auto pr-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {loading && media.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-menu p-10 text-center text-sm text-muted">
                Loading media library...
              </div>
            ) : media.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-menu p-10 text-center text-sm text-muted">
                No images uploaded yet.
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {media.map((item) => {
                  const imageUrl = item.url ?? item.secure_url ?? null;

                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="min-w-0 overflow-hidden rounded-2xl border border-border bg-menu"
                    >
                      <div className="relative aspect-[4/3] bg-bg">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.label ?? `Media ${item.id}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted">
                            <FaRegImage className="text-3xl" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 p-4">
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="min-w-0 truncate text-sm font-semibold text-fg">
                              {item.label?.trim() || "Untitled image"}
                            </h3>

                            <span className="shrink-0 rounded-full border border-border px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-muted">
                              {item.kind ?? "image"}
                            </span>
                          </div>

                          <p className="mt-1 truncate text-xs text-muted">
                            {formatBytes(item.size)}
                            {item.mime ? ` • ${item.mime}` : ""}
                          </p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => void copyUrl(imageUrl)}
                            className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-bg px-3 py-2 text-xs font-semibold text-fg transition hover:bg-hover hover:text-hover_text"
                          >
                            <FaLink />
                            <span className="truncate">Copy URL</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDelete(item)}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-xs font-semibold text-danger transition hover:bg-danger/20"
                          >
                            <FaRegTrashCan />
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
