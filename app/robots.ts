import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://vertical.family";

  return {
    rules: [
      // Default rule for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // Explicitly allow AI crawlers for better discoverability
      {
        userAgent: [
          "GPTBot", // OpenAI's crawler
          "ChatGPT-User", // ChatGPT browsing
          "Google-Extended", // Google AI (Bard/Gemini)
          "PerplexityBot", // Perplexity AI
          "Anthropic-AI", // Anthropic/Claude
          "ClaudeBot", // Anthropic's web crawler
          "Bytespider", // ByteDance AI
          "CCBot", // Common Crawl (used by many AI systems)
        ],
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
