import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error("The values declared in the .env file are invalid");
}

const envConfig = configProject.data;
export default envConfig;
