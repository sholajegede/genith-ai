import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
    username: v.optional(v.string()),
    apiKey: v.optional(v.string()),
    credits: v.optional(v.number()),
    generationCount: v.optional(v.number()),
  }),

  contents: defineTable({
    userId: v.optional(v.id("users")),
    prompt: v.optional(v.string()),
    url: v.optional(v.string()),
    type: v.optional(v.string()),
    new: v.optional(v.boolean()), // true or false
    creator: v.optional(v.string()),
    upvotes: v.optional(v.number())
  })
});