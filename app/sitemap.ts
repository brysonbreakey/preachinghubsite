import type { MetadataRoute } from "next";

const BASE_URL = "https://preachinghub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/pricing", "/compare", "/teams", "/try"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
