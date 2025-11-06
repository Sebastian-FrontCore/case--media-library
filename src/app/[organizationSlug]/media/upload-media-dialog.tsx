"use client";

import { Loader2, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useUploadThing } from "~/lib/uploadthing";
import { api } from "~/trpc/react";

interface UploadMediaDialogProps {
  organizationSlug: string;
}

export function UploadMediaDialog({
  organizationSlug,
}: UploadMediaDialogProps) {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [imageDimensions, setImageDimensions] = useState<
    Array<{ width: number; height: number }>
  >([]);
  const utils = api.useUtils();
  const createMedia = api.media.create.useMutation();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: async (res) => {
      console.log("Upload complete:", res);

      for (let i = 0; i < res.length; i++) {
        const file = res[i]!;
        const dimensions = imageDimensions[i];
        const fileName = file.name || "Untitled";

        await createMedia.mutateAsync({
          organizationSlug,
          name: fileName,
          altText: fileName,
          url: file.url,
          mimeType: file.type || "image/jpeg",
          sizeBytes: file.size,
          width: dimensions?.width ?? null,
          height: dimensions?.height ?? null,
        });
      }

      await utils.media.getAll.invalidate({ organizationSlug });
      setFiles([]);
      setPreviews([]);
      setImageDimensions([]);
      setOpen(false);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
    },
  });

  const getImageDimensions = (
    file: File
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    const dimensions = await Promise.all(
      selectedFiles.map((file) => getImageDimensions(file))
    );
    setImageDimensions(dimensions);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const url = prev[index];
      if (url) {
        URL.revokeObjectURL(url);
      }
      return prev.filter((_, i) => i !== index);
    });
    setImageDimensions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    await startUpload(files);
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button className="gap-2" size="sm" variant="outline">
          <UploadIcon className="size-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Media</DialogTitle>
          <DialogDescription>
            Upload images to your media library. Max file size: 4MB, up to 10
            files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {files.length === 0 ? (
            <label
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-border border-dashed bg-muted/30 p-12 transition-colors hover:border-primary/50 hover:bg-muted/50"
              htmlFor="file-upload"
            >
              <UploadIcon className="mb-4 size-12 text-muted-foreground" />
              <p className="mb-2 font-medium text-foreground text-sm">
                Choose files or drag and drop
              </p>
              <p className="text-muted-foreground text-xs">
                Images up to 4MB, max 10 files
              </p>
              <input
                accept="image/*"
                className="hidden"
                disabled={isUploading}
                id="file-upload"
                multiple
                onChange={handleFileChange}
                type="file"
              />
            </label>
          ) : (
            <>
              <div className="grid max-h-[400px] grid-cols-2 gap-4 overflow-y-auto sm:grid-cols-3">
                {previews.map((preview, index) => (
                  <div
                    className="group relative aspect-square overflow-hidden rounded-lg"
                    key={`preview-image-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: it's fine for now
                      index
                    }`}
                  >
                    <Image
                      alt={`Preview ${index + 1}`}
                      className="h-full w-full object-cover"
                      fill
                      src={preview}
                    />
                    <button
                      className="-right-2 -top-2 absolute rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                      disabled={isUploading}
                      onClick={() => removeFile(index)}
                      type="button"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  disabled={isUploading}
                  onClick={handleUpload}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    `Upload ${files.length} file${
                      files.length !== 1 ? "s" : ""
                    }`
                  )}
                </Button>
                <Button
                  disabled={isUploading}
                  onClick={() => {
                    setFiles([]);
                    previews.forEach((url) => {
                      URL.revokeObjectURL(url);
                    });
                    setPreviews([]);
                    setImageDimensions([]);
                  }}
                  variant="outline"
                >
                  Clear
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
