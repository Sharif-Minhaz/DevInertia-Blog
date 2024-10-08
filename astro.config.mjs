import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import pagefind from "astro-pagefind";
import icon from "astro-icon";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
	site: "https://dev-inertia-blog.netlify.app",
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
					"arrow-top",
				],
			},
		}),
		react(),
	],
});
