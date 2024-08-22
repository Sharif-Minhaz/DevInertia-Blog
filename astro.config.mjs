import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import pagefind from "astro-pagefind";
import icon from "astro-icon";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [
		mdx(),
		sitemap(),
		tailwind(),
		pagefind(),
		icon({
			include: {
				mdi: [
					"home-account",
					"blog-outline",
					"about-circle-outline",
					"tag-text",
					"chevron-double-right",
					"chevron-right",
					"chevron-left",
					"chevron-double-left",
					"search",
					"window-close",
				],
			},
		}),
		preact(),
	],
});
