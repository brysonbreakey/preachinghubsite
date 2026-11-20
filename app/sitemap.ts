import type { MetadataRoute } from "next";

const BASE_URL = "https://preachinghub.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/pricing", "/teams", "/try", "/about", "/features/sermon-feedback", "/features/sermon-builder", "/features/preaching-dna"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));
}
