import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: "postgresql://neondb_owner:npg_86abwYiFVJhc@ep-nameless-cloud-aiq520u5-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
});
