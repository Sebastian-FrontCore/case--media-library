"use client";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { useGetAllMedia } from "~/server/api/routers/media/hooks";

export function MediaList({ organizationSlug }: { organizationSlug: string }) {
  const { data: mediaData, status } = useGetAllMedia(organizationSlug);

  if (status === "pending") {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground text-sm">Loading media...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImageIcon className="text-destructive" />
          </EmptyMedia>
          <EmptyTitle>Error loading media</EmptyTitle>
          <EmptyDescription>
            There was a problem loading your media. Please try again later.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (mediaData?.items?.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImageIcon />
          </EmptyMedia>
          <EmptyTitle>No Media Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t uploaded any media yet. Get started by uploading
            your first image.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button>Upload Media</Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 md:columns-3 lg:columns-4">
      {mediaData.items.map((item) => (
        <div className="group relative mb-4 break-inside-avoid" key={item.id}>
          <div className="relative overflow-hidden rounded-lg bg-muted/30 transition-transform hover:scale-[1.02]">
            <div
              className="relative"
              style={{ aspectRatio: `${item.width} / ${item.height}` }}
            >
              <Image
                alt={item.altText}
                className="object-cover"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                src={item.url}
              />
            </div>

            <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <div className="mt-2 px-1">
            <p className="line-clamp-1 font-light text-foreground/90 text-xs">
              {item.name}
            </p>
            <p className="line-clamp-1 font-light text-muted-foreground/70 text-xs">
              {item.altText}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
