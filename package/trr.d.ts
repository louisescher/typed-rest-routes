import type { ZodUndefined } from "astro:schema";
import type { HTTPMethod, WrappedAPIRoute } from "./src/types"

declare global {
	/**
	 * A mock type for the generated TypedRoutes interface.
	 */
	interface TypedRoutes {
		[route: string]: {
			[method: string]: WrappedAPIRoute<ZodUndefined> & {
				_result: any
			};
		};
	}
}