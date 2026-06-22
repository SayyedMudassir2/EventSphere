"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { UploadCloud, Loader2, AlertCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUpload: (path: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isPending, startTransition] = useTransition();
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Clean up the object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Invalid file type. Please upload an image asset.");
      return;
    }

    setErrorMsg(null);
    setPreviewName(file.name);

    // Generate temporary local preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    startTransition(async () => {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `events/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("events")
          .upload(filePath, file, { cacheControl: "3600", upsert: false });

        if (uploadError) throw uploadError;

        onUpload(filePath);
      } catch (err) {
        setPreviewUrl(null);
        setPreviewName(null);
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "Media upload transmission pipeline failed.",
        );
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileProcess(e.dataTransfer.files[0]);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening file picker
    setPreviewUrl(null);
    setPreviewName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-3 select-none">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 px-6 py-8 text-center cursor-pointer transition-all duration-150 outline-none hover:border-indigo-500/50 hover:bg-indigo-600/5 group/dropzone will-change-[border-color,background-color]",
          dragActive && "border-indigo-500 bg-indigo-600/10 scale-[1.01]",
          isPending && "pointer-events-none opacity-40",
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          disabled={isPending}
          onChange={(e) =>
            e.target.files?.[0] && handleFileProcess(e.target.files[0])
          }
          className="hidden"
        />

        {/* Clear Action Overlay Button */}
        {previewUrl && !isPending && (
          <button
            type="button"
            onClick={clearFile}
            className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <div className="flex flex-col items-center justify-center space-y-2.5 w-full">
          {/* Visual Container: Icon or Image Preview */}
          {previewUrl ? (
            <div className="relative h-20 w-20 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Upload preview"
                className="h-full w-full object-cover"
              />
              {isPending && (
                <div className="absolute inset-0 bg-zinc-950/60 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
                </div>
              )}
            </div>
          ) : (
            <div
              className={cn(
                "p-2.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-500 transition-colors duration-150 group-hover/dropzone:border-indigo-500/30 group-hover/dropzone:text-indigo-400",
                dragActive && "border-indigo-500/30 text-indigo-400",
              )}
            >
              <UploadCloud className="h-5 w-5" />
            </div>
          )}

          <div className="space-y-0.5 text-xs font-medium">
            <p className="text-zinc-200">
              {isPending
                ? "Transmitting asset..."
                : previewName
                  ? "Click to replace image"
                  : "Click to select or drag & drop"}
            </p>
            <p className="text-[10px] text-zinc-500 tracking-normal font-normal max-w-xs truncate px-4 mx-auto">
              {previewName ? previewName : "PNG, JPEG, or WEBP up to 5MB"}
            </p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl bg-red-500/5 border border-red-500/20 p-3.5 text-xs text-red-400 select-text animate-fade-in"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <span className="font-semibold truncate">{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
