import type { HTTPMethod } from "./src/types"

declare module "trr:server" {
	/**
	 * TODO: JSDoc
	 */
	export function defineRoute<Schema extends import("astro/zod").ZodTypeAny>(options: import("./src/types").RouteDefinition<Schema>): import("astro").APIRoute;
}

interface TypedRoutes {
	[key: string]: {
		[key: import('./src/types').HTTPMethod]: (...args: any) => any;
	}
}

declare module "trr:client" {
	/**
	 * TODO: JSDoc
	 */
	export function callRoute<Data extends import("astro/zod").infer<import("astro/zod").ZodTypeAny>>(url: string, method: string, data: Data): Promise<Response>;
}