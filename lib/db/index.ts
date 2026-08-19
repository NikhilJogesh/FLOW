import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@libsql/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const url = process.env.DATABASE_URL || 'file:./dev.db';

let adapter = undefined;
if (url.startsWith('libsql://') || url.startsWith('https://')) {
  const libsql = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });
  // @ts-ignore
  adapter = new PrismaLibSql(libsql);
}

export const prisma = globalForPrisma.prisma ?? (adapter ? new PrismaClient({ adapter } as any) : new PrismaClient());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
