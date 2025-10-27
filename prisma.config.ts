import "dotenv/config"; // <- toto načíta .env premenné
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"), // teraz už Prisma vidí DATABASE_URL
  },
});
