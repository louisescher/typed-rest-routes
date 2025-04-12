// @ts-check
import { defineConfig } from 'astro/config';
import typedRestRoutes from "typed-rest-routes";

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    integrations: [typedRestRoutes(), react()]
});