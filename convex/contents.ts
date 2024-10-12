import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const saveContent = mutation({
  args: {
    userId: v.optional(v.id("users")),
    prompt: v.optional(v.string()),
    url: v.optional(v.string()),
    type: v.optional(v.string()),
    creator: v.optional(v.string())
  },
  handler: async (ctx, { userId, prompt, url, type, creator }) => {
    await ctx.db.insert("contents", {
      userId,
      prompt,
      url,
      type,
      new: true,
      creator,
      upvotes: 0
    });
  },
});

export const markContentAsViewed = mutation({
  args: {
    contentId: v.id("contents"),
  },
  handler: async (ctx, { contentId }) => {
    const content = await ctx.db.get(contentId);
    if (!content) {
      throw new Error("Content not found");
    }

    if (content.new === true) {
      await ctx.db.patch(contentId, { new: false });
    }
  },
});


export const upvoteContent = mutation({
  args: {
    contentId: v.id("contents"),
  },
  handler: async (ctx, { contentId }) => {
    const content = await ctx.db.get(contentId);
    if (!content) {
      throw new Error("Content not found");
    }

    await ctx.db.patch(contentId, { upvotes: (content.upvotes || 0) + 1 });
  },
});

export const getContent = query({
  args: {
    contentId: v.id("contents")
  },
  handler: (ctx, { contentId }) => {
    if (!contentId) return null;
    return ctx.db.get(contentId);
  },
});

export const getAllContents = query({
  handler: async (ctx) => {
    const contents = await ctx.db.query("contents").collect();
    return contents;
  },
});

export const getContentsByUserId = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    const contents = await ctx.db
      .query("contents")
      .filter(q => q.eq(q.field("userId"), userId))
      .collect();

    return contents;
  },
});

export const getTotalUpvotesByUserId = query({
  args: {
    userId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const { userId } = args;

    const contents = await ctx.db
      .query("contents")
      .filter(q => q.eq(q.field("userId"), userId))
      .collect();

    const totalUpvotes = contents.reduce((sum, content) => {
      return sum + (content.upvotes || 0);
    }, 0);

    return totalUpvotes;
  },
});