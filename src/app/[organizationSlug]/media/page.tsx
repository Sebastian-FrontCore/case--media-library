import { HydrateClient } from "~/trpc/server";
import { MediaList } from "./media-list";
import { UploadMediaDialog } from "./upload-media-dialog";

export default async function MediaPage({
  params,
}: PageProps<"/[organizationSlug]/media">) {
  const { organizationSlug } = await params;

  return (
    <HydrateClient>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-light text-2xl text-foreground tracking-tight">
              Your Library
            </h1>
            <p className="mt-1 text-muted-foreground text-sm">
              {organizationSlug}
            </p>
          </div>
          <UploadMediaDialog organizationSlug={organizationSlug} />
        </div>

        <MediaList organizationSlug={organizationSlug} />
      </div>
    </HydrateClient>
  );
}
