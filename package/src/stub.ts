/**
 * This module contains a stub file for type generation
 * @module
 */

import { createResolver } from "astro-integration-kit";

const { resolve } = createResolver(import.meta.url);

const stub = `
declare module "typed-rest-routes/server" {
	/**
	 * A function that can be used to define a type-safe server endpoint.
	 * @param options - The options for the route.
	 * @returns An Astro compatible APIRoute.
	 */
	export const defineRoute: typeof import("${resolve('./server.js')}").defineRoute;
}

type TypedRoutes = import("%TYPED_ROUTES_LOCATION%").TypedRoutes;

declare module "typed-rest-routes/client" {
	/**
	 * A function that can be used to call a type-safe server endpoint.
	 * @param url - The URL of the route.
	 * @param method - The HTTP method to use.
	 * @param data - The data to send to the route.
	 * @returns A promise that resolves to the result of the route.
	 */
	export const callRoute: typeof import("${resolve('./client.js')}").callRoute;
}
`;

export { stub };