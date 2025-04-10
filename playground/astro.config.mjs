// @ts-check
import { defineConfig } from 'astro/config';
import typedRestRoutes from "typed-rest-routes";

// https://astro.build/config
export default defineConfig({
	output: 'server',
	integrations: [typedRestRoutes()]
});
