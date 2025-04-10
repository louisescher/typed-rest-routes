/**
 * This module contains a stub file for type generation
 * @module
 */

import { createResolver } from "astro-integration-kit";

const { resolve } = createResolver(import.meta.url);

const stub = `
declare module "trr:server" {
	/**
	 * A function that can be used to define a type-safe server endpoint.
	 * @param options - The options for the route.
	 * @returns An Astro compatible APIRoute.
	 */
	export const defineRoute: typeof import("${resolve('./wrappers.js')}").defineRoute;
}

type ImportedTypedRoutes = import("%TYPED_ROUTES_LOCATION%").TypedRoutes;

declare module "trr:client" {
	/**
	 * A function that can be used to call a type-safe server endpoint.
	 * @param url - The URL of the route.
	 * @param method - The HTTP method to use.
	 * @param data - The data to send to the route.
	 * @returns A promise that resolves to the result of the route.
	 */
	export function callRoute<
		Route extends keyof ImportedTypedRoutes,
		Method extends keyof ImportedTypedRoutes[Route],
		Data extends Parameters<ImportedTypedRoutes[Route][Method]>[1],
		Result extends ReturnType<ImportedTypedRoutes[Route][Method]>['_result']
	>(
		...args: (Data extends import("astro/zod").ZodUndefined ? [url: Route, method: Method] : [url: Route, method: Method, data: Data])
	): Promise<Result>;
}
`;

export { stub };