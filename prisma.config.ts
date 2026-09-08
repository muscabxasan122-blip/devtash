import "dotenv/config";

import { defineConfig, env } from "prisma/config";

// Prisma 7 reads the datasource URL from here rather than from the
// `datasource` block, and no longer loads .env on its own.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
