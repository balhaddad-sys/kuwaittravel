"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import { Upload, X, FileText } from "lucide-react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // MB
  onFilesChange: (files: File[]) => void;
  error?: string;
  hint?: string;
  className?: string;
}

function FileUpload({
  label,
  accept,
  multiple = false,
  maxSize = 10,
  onFilesChange,
  error,
  hint,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (newFiles: FileList | null) => {
      if (!newFiles) return;
      const validFiles = Array.from(newFiles).filter(
        (f) => f.size <= maxSize * 1024 * 1024
      );
      const updated = multiple ? [...files, ...validFiles] : validFiles.slice(0, 1);
      setFiles(updated);
      onFilesChange(updated);
    },
    [files, multiple, maxSize, onFilesChange]
  );

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFilesChange(updated);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-label font-medium text-navy-700 dark:text-navy-200">
          {label}
        </label>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border-2 border-dashed p-8 transition-all duration-200",
          dragActive
            ? "border-navy-500 bg-navy-50 dark:bg-navy-900/20"
            : "border-surface-border dark:border-surface-dark-border hover:border-navy-400 hover:bg-surface-muted dark:hover:bg-surface-dark-card",
          error && "border-error"
        )}
      >
        <Upload className="h-8 w-8 text-navy-400" />
        <p className="text-body-md text-navy-600 dark:text-navy-300">
          اسحب الملفات هنا أو اضغط للاختيار
        </p>
        <p className="text-body-sm text-navy-400">
          الحد الأقصى {maxSize} ميغابايت
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2 mt-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-2 rounded-[var(--radius-md)] bg-surface-muted dark:bg-surface-dark-card p-2"
            >
              <FileText className="h-4 w-4 text-navy-500 shrink-0" />
              <span className="text-body-sm text-navy-700 dark:text-navy-200 flex-1 truncate">
                {file.name}
              </span>
              <span className="text-body-sm text-navy-400 shrink-0">
                {(file.size / 1024 / 1024).toFixed(1)} MB
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                className="shrink-0 rounded p-1 text-navy-400 hover:text-error transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-body-sm text-error">{error}</p>}
      {hint && !error && <p className="text-body-sm text-navy-400">{hint}</p>}
    </div>
  );
}

export { FileUpload, type FileUploadProps };
