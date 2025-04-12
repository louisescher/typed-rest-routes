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