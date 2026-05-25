import { PrismaClient } from "#generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { env } from "#shared/env";

const createPrismaClient = (): PrismaClient => {
  const adapter = new PrismaNeon({
    connectionString: env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma
}

// the approach before so neon won't start rejecting your connections because when tsx restart your server 
// it reimport all the modules including prisma.ts so if you used the default approach it will create a dozen of connections
