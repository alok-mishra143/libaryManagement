import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { cPrisma } from "../Shared/Global";

export const auth = betterAuth({
  database: prismaAdapter(cPrisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
