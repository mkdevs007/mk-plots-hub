import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, File, X, CheckCircle2, Film, ArrowLeft, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface CloudinaryUploadProps {
  value: string | string[];
  onChange: (url: any) => void;
  accept: "image/*" | "video/*" | string;
  label: string;
  multiple?: boolean;
}

// Helper to resolve environment variables in both Node.js server (process.env) and Vite client (import.meta.env)
const getEnv = (key: string): string => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] || "";
  }
  // @ts-ignore
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key] || "";
  }
  return "";
};

const CLOUD_NAME = getEnv("VITE_CLOUDINARY_CLOUD_NAME");
const UPLOAD_PRESET = getEnv("VITE_CLOUDINARY_UPLOAD_PRESET");

export function CloudinaryUpload({ value, onChange, accept, label, multiple = false }: CloudinaryUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo = accept.includes("video");

  // Standardize values
  const valuesArray = multiple
    ? Array.isArray(value)
      ? value
      : value
        ? [value]
        : []
    : typeof value === "string"
      ? value
        ? [value]
        : []
      : [];

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // If multiple is enabled, upload all files
      if (multiple) {
        uploadMultipleFiles(Array.from(e.dataTransfer.files));
      } else {
        uploadFile(e.dataTransfer.files[0]);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (multiple) {
        uploadMultipleFiles(Array.from(e.target.files));
      } else {
        uploadFile(e.target.files[0]);
      }
    }
  };

  const uploadMultipleFiles = async (files: File[]) => {
    setError(null);
    setUploading(true);
    let uploadedUrls = [...valuesArray];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setProgress(0);
        toast.info(`Uploading file ${i + 1} of ${files.length}...`);
        const url = await uploadSingleFilePromise(file);
        uploadedUrls.push(url);
        onChange(uploadedUrls);
      } catch (err: any) {
        console.error(err);
        toast.error(`Failed to upload ${file.name}: ${err.message}`);
      }
    }
    setUploading(false);
    setProgress(0);
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadSingleFilePromise(file);
      onChange(url);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Upload failed.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const uploadSingleFilePromise = async (file: File): Promise<string> => {
    const cloudName = CLOUD_NAME || "";
    const uploadPreset = UPLOAD_PRESET || "";

    if (!cloudName || !uploadPreset) {
      // Fallback local address
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(file));
        }, 1000);
      });
    }

    const resourceType = isVideo ? "video" : "image";
    const chunkSize = 5 * 1024 * 1024; // 5MB
    const totalSize = file.size;

    if (totalSize <= chunkSize) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, true);

      return new Promise<string>((resolve, reject) => {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            resolve(res.secure_url);
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error"));
        xhr.send(formData);
      });
    } else {
      // Chunked Upload for large files (like 300MB video)
      const uniqueUploadId = Math.random().toString(36).substring(2, 15);
      let start = 0;
      let secureUrl = "";

      while (start < totalSize) {
        const end = Math.min(start + chunkSize, totalSize);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        // Append chunk with filename to help Cloudinary recognize layout/media format
        formData.append("file", chunk, file.name);
        formData.append("upload_preset", uploadPreset);

        const chunkPromise = new Promise<any>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, true); // Asynchronous

          xhr.setRequestHeader("X-Unique-Upload-Id", uniqueUploadId);
          xhr.setRequestHeader("Content-Range", `bytes ${start}-${end - 1}/${totalSize}`);

          xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 201) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Chunk upload failed with status ${xhr.status}: ${xhr.responseText}`));
            }
          };
          xhr.onerror = () => reject(new Error("Chunk upload network error"));
          
          xhr.send(formData);
        });

        const response = await chunkPromise;
        if (response.secure_url) {
          secureUrl = response.secure_url;
        }

        start = end;
        setProgress(Math.round((start / totalSize) * 100));
      }

      if (secureUrl) {
        return secureUrl;
      } else {
        throw new Error("Failed to retrieve secure URL after chunked upload");
      }
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updated = valuesArray.filter((_, idx) => idx !== indexToRemove);
    if (multiple) {
      onChange(updated);
    } else {
      onChange("");
    }
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= valuesArray.length) return;
    
    const updated = [...valuesArray];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    
    onChange(multiple ? updated : updated[0]);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleSortStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleSortOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
  };

  const handleSortEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleSortDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const updated = [...valuesArray];
    const draggedItem = updated[draggedIndex];
    
    updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, draggedItem);
    
    onChange(multiple ? updated : updated[0]);
    handleSortEnd();
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>

      {/* Grid of uploaded items */}
      {valuesArray.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-2">
          {valuesArray.map((url, index) => (
            <div
              key={index}
              draggable={multiple && valuesArray.length > 1}
              onDragStart={(e) => handleSortStart(e, index)}
              onDragOver={(e) => handleSortOver(e, index)}
              onDragEnd={handleSortEnd}
              onDrop={(e) => handleSortDrop(e, index)}
              className={`relative group aspect-square rounded-xl overflow-hidden border bg-muted/40 animate-fade-up shadow-sm transition-all duration-300 cursor-grab active:cursor-grabbing ${
                index === draggedIndex ? "opacity-35 border-dashed border-gold" : "border-border hover:border-gold/50"
              } ${
                index === dragOverIndex && index !== draggedIndex ? "border-gold scale-102 ring-2 ring-gold/20" : ""
              }`}
            >
              {/* Media Preview */}
              {isVideo ? (
                <div className="w-full h-full bg-black/10 flex items-center justify-center relative">
                  <video
                    src={url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <Film className="w-6 h-6 text-white drop-shadow-md" />
                  </div>
                </div>
              ) : (
                <img
                  src={url}
                  alt={`Asset ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              )}

              {/* View/External Link Indicator (hover reveal overlay) */}
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10"
                title="View full asset"
              >
                <span className="text-[10px] text-white bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-xs border border-white/10 shadow-sm font-semibold uppercase tracking-wider">
                  View
                </span>
              </a>

              {/* Delete Button (Floating Top-Right) */}
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute top-1.5 right-1.5 z-20 p-1.5 rounded-full bg-black/60 hover:bg-destructive text-white hover:text-white backdrop-blur-sm transition shadow-md cursor-pointer border border-white/5"
                title="Remove asset"
              >
                <X className="w-3 h-3" />
              </button>

              {/* Reorder Buttons (Floating Bottom Center) */}
              {multiple && valuesArray.length > 1 && (
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-black/65 p-1 rounded-full backdrop-blur-sm shadow-md border border-white/10">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveFile(index, -1)}
                    className="p-0.5 rounded-full hover:bg-gold/80 text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    title="Move Left"
                  >
                    <ArrowLeft className="w-3 h-3" />
                  </button>
                  <span className="text-[9px] font-semibold text-white px-1 select-none">
                    {index + 1}
                  </span>
                  <button
                    type="button"
                    disabled={index === valuesArray.length - 1}
                    onClick={() => moveFile(index, 1)}
                    className="p-0.5 rounded-full hover:bg-gold/80 text-white disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                    title="Move Right"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hide uploader for single mode if already uploaded */}
      {(!multiple && valuesArray.length > 0) ? null : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2.5 ${
            dragActive
              ? "border-gold bg-gold/5"
              : "border-border hover:border-gold/50 bg-secondary/20 hover:bg-secondary/40"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            multiple={multiple}
            className="hidden"
            disabled={uploading}
          />

          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-gold transition">
            <UploadCloud className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground">
              {uploading ? "Uploading..." : `Upload ${multiple ? "files" : "file"}`}
            </p>
            <p className="text-[9px] text-muted-foreground mt-1">
              {isVideo ? "Supports MP4, WebM (up to 300MB)" : "Supports JPG, PNG, WebP"}
            </p>
          </div>

          {(!CLOUD_NAME || !UPLOAD_PRESET) && (
            <p className="text-[9px] text-amber-500 font-medium">
              Offline Test Mode: Local URLs will be generated
            </p>
          )}

          {uploading && (
            <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-xl p-4 flex flex-col items-center justify-center gap-2.5">
              <Progress value={progress} className="w-3/4 h-1.5" />
              <p className="text-[11px] font-semibold text-gold">{progress}% Uploaded</p>
            </div>
          )}

          {error && <p className="text-xs text-destructive font-medium mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
}
