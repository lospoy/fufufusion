import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const ClerkUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

// Create a new ratelimiter, that allows 1 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "1 m"),
  analytics: true,
});

export const usersRouter = createTRPCRouter({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      return user;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      take: 100,
      orderBy: [{ createdOn: "desc" }], //descending, newest first
    });

    return users;
  }),
});
