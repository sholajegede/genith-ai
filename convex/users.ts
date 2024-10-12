import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").order("desc").collect();
  },
});

export const getUserById = query({
  args: { clerkId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

export const getUserByPlainId = query({
  args: { profileId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.profileId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  }
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    username: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      username: args.username,
      generationCount: 0,
      credits: 5
    });
  }
});

export const updateUser = mutation({
  args: {
    userId: v.id("users"),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    apiKey: v.optional(v.string()),
    credits: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const updateFields = {
      ...(args.email !== undefined && { email: args.email }),
      ...(args.username !== undefined && { username: args.username }),
      ...(args.apiKey !== undefined && { apiKey: args.apiKey }),
      ...(args.credits !== undefined && { credits: args.credits })
    };

    await ctx.db.patch(args.userId, updateFields);

    return args.userId;
  },
});

export const incrementGenerationCount = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found");
    }

    if ((user.credits || 0) <= 0) {
      throw new Error("Insufficient credits");
    }

    const newCount = (user.generationCount || 0) + 1;

    const updatedCredits = (user.credits || 0) - 1;

    await ctx.db.patch(args.userId, {
      generationCount: newCount,
      credits: updatedCredits,
    });

    return newCount;
  },
});

export const deleteUser = mutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError("User not found");
    }

    return await ctx.db.delete(args.userId);
  },
});

export const updateClerkUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    const updateFields = {
      ...(args.clerkId !== undefined && { clerkId: args.clerkId }),
      ...(args.email !== undefined && { email: args.email })
    };

    await ctx.db.patch(user._id, updateFields);

    return user._id;
  },
});

export const deleteClerkUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);
  },
});