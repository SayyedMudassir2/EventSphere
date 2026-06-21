// app/components/ImageUpload.tsx
"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function ImageUpload({
  onUpload,
}: {
  onUpload: (path: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("events") // Ensure this is the bucket name you just created
        .upload(filePath, file);

      if (uploadError) {
        console.error("DEBUG: Upload failed:", uploadError); // Check your Browser Console (F12)
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`); // This will tell you the actual error
    } finally {
      setUploading(false);
    }
  };

  return (
    <input
      type="file"
      onChange={uploadFile}
      disabled={uploading}
      accept="image/*"
    />
  );
}
