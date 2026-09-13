"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useDropzone } from "react-dropzone";
import { X, Upload, Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
}

export function ImageUploader({
  images,
  onImagesChange,
  maxImages = 5,
  maxSize = 5,
}: ImageUploaderProps) {
  const t = useTranslations();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError("");
      setUploadProgress(0);

      // Check max images limit
      if (images.length + acceptedFiles.length > maxImages) {
        setError(t("admin.upload.maxFilesError", { max: maxImages }));
        return;
      }

      // Validate file sizes
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxSize * 1024 * 1024
      );
      if (oversizedFiles.length > 0) {
        setError(t("admin.upload.maxSizeError", { maxSize }));
        return;
      }

      setUploading(true);

      try {
        const uploadedUrls: string[] = [];
        const totalFiles = acceptedFiles.length;

        for (let i = 0; i < acceptedFiles.length; i++) {
          const file = acceptedFiles[i];
          const formData = new FormData();
          formData.append("image", file);

          const response = await fetch("/api/v1/upload", {
            method: "POST",
            body: formData,
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error(t("admin.upload.uploadFailed"));
          }

          const data = await response.json();
          uploadedUrls.push(data.data.url);

          // Update progress
          setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
        }

        onImagesChange([...images, ...uploadedUrls]);
      } catch (err) {
        setError(t("admin.upload.uploadError"));
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [images, maxImages, maxSize, onImagesChange, t]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    disabled: uploading || images.length >= maxImages,
    multiple: true,
    maxFiles: maxImages - images.length,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const canUploadMore = images.length < maxImages;
  const remainingSlots = maxImages - images.length;

  return (
    <div className="space-y-4">
      {/* Images Grid First - Better UX */}
      {images.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">
              {t("admin.upload.uploadedImages")} ({images.length}/{maxImages})
            </p>
            {canUploadMore && (
              <p className="text-xs text-gray-500">
                {t("admin.upload.canAddMore", { count: remainingSlots })}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-400 transition-colors bg-gray-50"
              >
                <Image
                  src={image}
                  alt={t("admin.upload.imageAlt", { index: index + 1 })}
                  fill
                  className="object-cover"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1.5 right-1.5 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  disabled={uploading}
                  title={t("admin.upload.remove")}
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Image Number Badge */}
                {index === 0 && (
                  <div className="absolute bottom-1.5 left-1.5 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                    {t("admin.upload.primary")}
                  </div>
                )}
                {index > 0 && (
                  <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Area */}
      {canUploadMore && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-all ${isDragActive
              ? "border-purple-500 bg-purple-50 scale-[1.02]"
              : uploading
                ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"
            }`}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <>
                <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                <div className="w-full max-w-xs">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>{t("admin.upload.uploading")}</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-purple-600 h-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  {isDragActive ? (
                    <CheckCircle2 className="w-7 h-7 text-purple-600" />
                  ) : (
                    <Upload className="w-7 h-7 text-purple-600" />
                  )}
                </div>

                {isDragActive ? (
                  <div>
                    <p className="text-base font-medium text-purple-600">
                      {t("admin.upload.dropHere")}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-base font-medium text-gray-700 mb-1">
                      {t("admin.upload.dragOrClick")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {t("admin.upload.fileTypes", { maxSize })}
                    </p>
                    <p className="text-xs text-purple-600 font-medium mt-2">
                      {t("admin.upload.remainingSlots", { count: remainingSlots })}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Max Reached Message */}
      {!canUploadMore && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <p className="text-sm font-medium text-purple-800">
            {t("admin.upload.maxReached", { max: maxImages })}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {t("admin.upload.removeToAddMore")}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Helper Text */}
      {images.length === 0 && (
        <p className="text-xs text-center text-gray-500">
          {t("admin.upload.helpText")}
        </p>
      )}
    </div>
  );
}
