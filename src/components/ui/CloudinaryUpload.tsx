import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, File, X, CheckCircle2, Film } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface CloudinaryUploadProps {
  value: string | string[];
  onChange: (url: any) => void;
  accept: "image/*" | "video/*";
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

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </label>

      {/* Grid of uploaded items */}
      {valuesArray.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mb-2">
          {valuesArray.map((url, index) => (
            <div
              key={index}
              className="relative group rounded-xl border border-border bg-muted/40 p-3 flex items-center justify-between gap-3 animate-fade-up"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {isVideo ? (
                  <div className="w-10 h-10 rounded bg-gold/10 flex items-center justify-center text-gold shrink-0">
                    <Film className="w-5 h-5" />
                  </div>
                ) : (
                  <img
                    src={url}
                    alt="Asset preview"
                    className="w-10 h-10 rounded object-cover border border-border shrink-0"
                  />
                )}
                <div className="overflow-hidden">
                  <p className="text-[11px] font-semibold truncate text-foreground">
                    Asset #{index + 1}
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[9px] text-gold hover:underline truncate block"
                  >
                    View asset
                  </a>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
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
