import type { HTTPMethod } from "./src/types"

declare global {
	/**
	 * A mock type for the generated TypedRoutes interface.
	 */
	interface TypedRoutes {
		[route: string]: {
			[method: string]: (...args: any[]) => Response & {
				_result: any;
			};
		};
	}
}

declare module "trr:server" {
	/**
	 * TODO: JSDoc
	 */
	export function defineRoute<Schema extends import("astro/zod").ZodTypeAny>(options: import("./src/types").RouteDefinition<Schema>): import("astro").APIRoute;
}

declare module "trr:client" {
	/**
	 * TODO: JSDoc
	 */
	export function callRoute<Data extends import("astro/zod").infer<import("astro/zod").ZodTypeAny>>(url: string, method: string, data: Data): Promise<Response>;
}