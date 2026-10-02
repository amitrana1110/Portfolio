import { portfolio } from "@/data/portfolio";
import { siteOrigin, isPublicOrigin } from "@/lib/site-url";
export default function sitemap() {
  const origin = siteOrigin();
  if (!isPublicOrigin(origin)) return [];
  return [
    "/",
    "/contact",
    ...portfolio.projects.map((project) => `/projects/${project.slug}`),
  ].map((path) => ({
    url: new URL(path, origin).href,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
