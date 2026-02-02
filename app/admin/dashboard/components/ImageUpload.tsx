"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { uploadImageAction } from "../../actions";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageUploadProps {
  name: string;
  label: string;
  currentUrl?: string | null;
  slug: string;
  type: "thumbnail" | "background";
  onUploadComplete: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({
  name,
  label,
  currentUrl,
  slug,
  type,
  onUploadComplete,
  disabled = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Invalid file type. Allowed: JPEG, PNG, WebP";
    }
    if (file.size > MAX_SIZE) {
      return "File too large. Maximum size is 5MB";
    }
    return null;
  };

  const handleUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      if (!slug) {
        setError("Please enter a title first to generate a slug");
        return;
      }

      setError(null);
      setIsUploading(true);

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("slug", slug);
        formData.append("type", type);

        const result = await uploadImageAction(formData);

        if ("error" in result) {
          setError(result.error);
          setPreviewUrl(currentUrl || null);
          URL.revokeObjectURL(objectUrl);
        } else {
          // Update preview to actual S3 URL and notify parent
          URL.revokeObjectURL(objectUrl);
          setPreviewUrl(result.url);
          onUploadComplete(result.url);
        }
      } catch {
        setError("Upload failed. Please try again.");
        setPreviewUrl(currentUrl || null);
        URL.revokeObjectURL(objectUrl);
      } finally {
        setIsUploading(false);
      }
    },
    [slug, type, currentUrl, onUploadComplete]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled || isUploading) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleUpload(files[0]);
      }
    },
    [disabled, isUploading, handleUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleUpload(files[0]);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [handleUpload]
  );

  const handleRemove = useCallback(() => {
    setPreviewUrl(null);
    setError(null);
    onUploadComplete("");
  }, [onUploadComplete]);

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Hidden input to store the URL value for form submission */}
      <input type="hidden" name={name} value={previewUrl || ""} />

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg transition-colors cursor-pointer
          ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}
          ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
          ${previewUrl ? "p-2" : "p-8"}
        `}
      >
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt={`${type} preview`}
              className="w-full h-40 object-cover rounded"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            {!isUploading && !disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              <Upload className="h-8 w-8" />
            )}
            <div className="text-sm text-center">
              <span className="font-medium">Click to upload</span> or drag and drop
            </div>
            <p className="text-xs">JPEG, PNG, or WebP (max 5MB)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
