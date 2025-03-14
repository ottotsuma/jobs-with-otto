const fs = require("fs");
const path = require("path");

const baseUrl = "https://jobswithotto.netlify.app/"; //  domain

const staticPages = [
    "",
    "/jobs",
    "/about",
    "/contact",
    "/blog", // Add all your static pages
];

const dynamicRoutes = [
    // Example: Replace with your job listing dynamic paths
    "/vacancies/1",
    "/vacancies/2",
    "/vacancies/3",
];

const pages = [...staticPages, ...dynamicRoutes];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
        .map(
            (page) => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
  </url>
  `
        )
        .join("")}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), "public/sitemap.xml"), sitemap);

console.log("✅ Sitemap generated successfully!");
