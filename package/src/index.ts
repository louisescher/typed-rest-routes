import fs from 'node:fs';
import type { Plugin } from "vite";
import { addVirtualImports, createResolver, defineIntegration, addVitePlugin } from "astro-integration-kit";
import { stub } from "./stub.js";
import { generateEndpoints, generateRouteTypes } from "./utils.js";
import type { AstroIntegrationLogger, InjectedType } from "astro";
import type { Endpoint, SSRLoadModuleFn } from "./types.js";

/**
 * An integration that adds support for typed server endpoints in Astro.
 */
export default defineIntegration({
	name: "typed-rest-routes",
	setup({ name }) {
		const { resolve } = createResolver(import.meta.url);

		let endpoints: Endpoint[] = [];
		let finishedRoutesDTS: string;

		let _injectTypes: (injectedType: InjectedType) => URL;
		let injectedTypesPath: ReturnType<typeof _injectTypes>;

		let _ssrLoadModule: SSRLoadModuleFn;
		let _logger: AstroIntegrationLogger;

		/**
		 * A Vite plugin that handles hot updates for the typed routes.
		 */
		const plugin: Plugin = {
			name: "trr-hot-updates",
			handleHotUpdate: async ({ file }) => {
				try {
					if (!file.endsWith(".ts") && !file.endsWith(".js") || file.endsWith(".d.ts")) return;
					
					const endpoint = endpoints.find((endpoint) => file.includes(endpoint.entrypoint));

					if (!endpoint) return;

					finishedRoutesDTS = await generateRouteTypes(endpoints, _ssrLoadModule, _logger);

					fs.writeFileSync(injectedTypesPath, finishedRoutesDTS);

					_logger.debug(`Updated typed routes for ${endpoint.routeTypeString}`);
				} catch (e) {
					_logger.error(`Failed to update types for ${file}: ${e}`);
				}
			}
		};

		return {
			hooks: {
				"astro:config:setup": (params) => {
					_logger = params.logger;

					addVitePlugin(params, { plugin });
					addVirtualImports(params, {
						name,
						imports: [
							{
								id: "trr:server",
								content: `export { defineRoute } from "${resolve('./wrappers.js')}"`,
								context: "server", 
							},
							{
								id: "trr:client",
								content: `export { callRoute } from "${resolve('./wrappers.js')}"`,
								context: "client",
							}
						]
					});
				},
				"astro:routes:resolved": async ({ routes }) => {
					const allEndpoints = routes.filter((route) => route.type === "endpoint" && !route.pattern.startsWith("/_"));

					endpoints = generateEndpoints(allEndpoints);
				},
				"astro:config:done": ({ injectTypes }) => {
					_injectTypes = injectTypes;
					
					injectedTypesPath = injectTypes({
						filename: "trr-routes.d.ts",
						content: finishedRoutesDTS!,
					});

					let filePath = injectedTypesPath.pathname;

					const onWindows = process.platform === "win32";
					if (onWindows) {
						// Replace first slash
						filePath = filePath.replace(/^\//, "");
					}

					injectTypes({
						filename: "trr.d.ts",
						content: stub.replaceAll("%TYPED_ROUTES_LOCATION%", filePath),
					});
				},
				"astro:server:setup": async ({ server, logger }) => {
					_ssrLoadModule = server.ssrLoadModule;
					finishedRoutesDTS = await generateRouteTypes(endpoints, server.ssrLoadModule, logger);

					if (_injectTypes) {
						_injectTypes({
							filename: 'trr-routes.d.ts',
							content: finishedRoutesDTS,
						});
					}
				},
			}
		}
	},
});
