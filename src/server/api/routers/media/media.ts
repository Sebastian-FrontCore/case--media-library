import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const mediaListInput = z.object({
  organizationSlug: z.string().min(1),
});

const mediaItemInput = z.object({
  organizationSlug: z.string().min(1),
  id: z.number().int().positive(),
});

const updateMediaInput = mediaItemInput.extend({
  name: z.string().min(1),
  altText: z.string().min(1),
});

const createMediaInput = z.object({
  organizationSlug: z.string().min(1),
  name: z.string().min(1),
  altText: z.string().default(""),
  url: z.string().url(),
  mimeType: z.string().default("image/jpeg"),
  sizeBytes: z.number().int().positive(),
  width: z.number().int().positive().nullable().default(null),
  height: z.number().int().positive().nullable().default(null),
});

const mediaSelect = {
  id: true,
  name: true,
  altText: true,
  url: true,
  mimeType: true,
  sizeBytes: true,
  width: true,
  height: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const mediaRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(mediaListInput)
    .query(async ({ ctx, input }) => {
      const { organizationSlug } = input;
      const organization = await ctx.db.organization.findUnique({
        where: { slug: organizationSlug },
        select: { id: true },
      });

      if (!organization) {
        return {
          items: [],
          total: 0,
          pageCount: 0,
        };
      }

      const [total, items] = await Promise.all([
        ctx.db.mediaAsset.count({
          where: { organizationId: organization.id },
        }),
        ctx.db.mediaAsset.findMany({
          where: { organizationId: organization.id },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          skip: 0,
          take: 8,
          select: mediaSelect,
        }),
      ]);

      return { items, total };
    }),

  create: publicProcedure
    .input(createMediaInput)
    .mutation(async ({ ctx, input }) => {
      const { organizationSlug, ...mediaData } = input;

      const organization = await ctx.db.organization.findUnique({
        where: { slug: organizationSlug },
        select: { id: true },
      });

      if (!organization) {
        throw new Error("Organization not found");
      }

      const media = await ctx.db.mediaAsset.create({
        data: {
          ...mediaData,
          organizationId: organization.id,
        },
        select: mediaSelect,
      });

      return media;
    }),
});
