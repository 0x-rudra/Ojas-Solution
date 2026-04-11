import { z } from "zod";

export const joinCommunitySchema = z.object({
  communityId: z.string().uuid("Invalid Community ID format"),
});

export const sendMessageSchema = z.object({
  communityId: z.string().uuid("Invalid Community ID format"),
  content: z.string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(1000, "Message exceeds 1000 characters limit"),
});
