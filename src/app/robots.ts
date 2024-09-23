import envConfig from "@/config/config";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/onboarding/"],
    },
    sitemap: `${envConfig.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
