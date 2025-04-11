import type { AstroIntegrationLogger, IntegrationResolvedRoute } from "astro";
import type { Endpoint, SSRLoadModuleFn } from "./types";
import { createResolver } from "astro-integration-kit";

/**
 * Generates an array of endpoints from the given routes.
 * @param routes - The routes to generate endpoints from.
 * @returns - An array of endpoints.
 */
export const generateEndpoints = (routes: IntegrationResolvedRoute[]): Endpoint[] => {
	const endpoints: Endpoint[] = [];

	for (const route of routes) {
		let joinedSegments: string = "";
		for (const segment of route.segments) {
			for (const subSegment of segment) {
				const { content, dynamic, spread } = subSegment;
				
				if (spread && dynamic) {
					joinedSegments += "/${string | undefined}";
					continue;
				}

				if (dynamic) {
					joinedSegments += "/${string}";
					continue;
				}
				
				joinedSegments += `/${content}`;
			}
		}

		endpoints.push({
			routeTypeString: joinedSegments,
			entrypoint: route.entrypoint
		});
	}

	return endpoints;
}

/**
 * Generates the types for the given endpoints and returns a DTS string.
 * @param endpoints - The endpoints to generate types for.
 * @param ssrLoadModule - The Vite SSR load module function.
 * @param logger - The Astro integration logger.
 * @returns - A promise that resolves to a DTS string.
 */
export const generateRouteTypes = async (
	endpoints: Endpoint[],
	ssrLoadModule: SSRLoadModuleFn,
	logger: AstroIntegrationLogger,
	rootPath: string
): Promise<string> => {
	const { resolve: projectRootResolve } = createResolver(rootPath);

	let dtsString = `export interface TypedRoutes {\n`;

	const HTTP_METHODS = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'];

	for (const { routeTypeString, entrypoint } of endpoints) {
		try {
			const module = await ssrLoadModule(entrypoint, { fixStacktrace: true });
			const modExports = Object.keys(module);
	
			dtsString += `  '${routeTypeString}': {\n`;
	
			for (const method of HTTP_METHODS.filter((method) => modExports.includes(method))) {
				dtsString += `    '${method}': typeof import("${projectRootResolve(`./${entrypoint}`)}").${method};\n`;
			}
	
			dtsString += `  },\n`;
		} catch (e) {
			logger.error(`Failed to load module for ${entrypoint}: ${e}`);
		}
	}

	return dtsString += `}`;
}