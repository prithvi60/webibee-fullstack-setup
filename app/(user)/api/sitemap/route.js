import { client } from "@/sanity/lib/client";
import { SitemapStream, streamToPromise } from "sitemap";
import { Readable } from "stream";

export async function GET() {
  // Static routes
  const links = [
    // { url: "/", changefreq: "daily", priority: 1.0 },
    // {
    //   url: "/",
    //   changefreq: "weekly",
    //   priority: 0.9,
    // },
    // { url: "/about", changefreq: "monthly", priority: 0.8 },
    // { url: "/services/content-B2B", changefreq: "weekly", priority: 0.9 },
    // { url: "/services/content-B2C", changefreq: "weekly", priority: 0.9 },
    // { url: "/services/founders", changefreq: "weekly", priority: 0.9 },
    // { url: "/resources/blog", changefreq: "weekly", priority: 0.9 },
    // { url: "/resources/works", changefreq: "weekly", priority: 0.9 },
    // { url: "/resources/media", changefreq: "weekly", priority: 0.9 },
    // {
    //   url: "/contact",
    //   changefreq: "monthly",
    //   priority: 0.9,
    // },
  ];

  try {
    // Fetch dynamic routes from Sanity CMS with error handling
    const posts = await client.fetch(
      `*[_type == "post"]{ "url": slug.current }`
    );
    posts.forEach((post) => {
      links.push({
        url: `/resources/blog/${post.url}`,
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      });
    });

    const hostname = "https://webibee.com";
    if (!hostname) {
      throw new Error("Hostname is required");
    }

    // Generate sitemap with proper error handling
    const stream = new SitemapStream({
      hostname: hostname,
      xmlns: {
        news: false,
        xhtml: true,
        image: false,
        video: false,
      },
    });

    const xmlString = await streamToPromise(
      Readable.from(links).pipe(stream)
    ).then((data) => data.toString());

    // Return with proper headers and cache control
    return new Response(xmlString, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      {
        status: 500,
        headers: {
          "Content-Type": "application/xml",
          "Cache-Control": "no-cache",
        },
      }
    );
  }
}
