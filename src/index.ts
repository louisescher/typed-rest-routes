import { addVirtualImports, createResolver, defineIntegration } from "astro-integration-kit";
import { stub } from "./stub.js";
import type { InjectedType } from "astro";

/**
 * An integration that adds support for typed server endpoints in Astro.
 */
export default defineIntegration({
    name: "typed-rest-routes",
    setup({ name }) {
        let finishedRoutesDTS: string | null = null;
        const endpoints: Array<{ routeTypeString: string, entrypoint: string }> = [];
        let _injectTypes: (injectedType: InjectedType) => URL;

        const { resolve } = createResolver(import.meta.url);

        return {
            hooks: {
                "astro:config:setup": (params) => {
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

                    for (const endpoint of allEndpoints) {
                        let joinedSegments: string = "";
                        for (const segment of endpoint.segments) {
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
                            entrypoint: endpoint.entrypoint
                        });
                    }
                },
                "astro:config:done": ({ injectTypes }) => {
                    _injectTypes = injectTypes;
                    
                    const routesLoc = injectTypes({
                        filename: "trr-routes.d.ts",
                        content: finishedRoutesDTS!,
                    });

                    let filePath = routesLoc.pathname;

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
                "astro:server:setup": async (params) => {
                    finishedRoutesDTS = `export interface TypedRoutes {\n`;

                    const HTTP_METHODS = ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD'];

                    for (const { routeTypeString, entrypoint } of endpoints) {
                        const module = await params.server.ssrLoadModule(entrypoint);
                        const modExports = Object.keys(module);
    
                        finishedRoutesDTS += `  '${routeTypeString}': {\n`;

                        let entrypointPath = entrypoint;

                        const onWindows = process.platform === "win32";
                        if (!onWindows) {
                            // Manual fix for linux not picking up on the right path
                            entrypointPath = `../../../${entrypoint}`;
                        }

                        for (const method of HTTP_METHODS.filter((method) => modExports.includes(method))) {
                            finishedRoutesDTS += `    '${method}': typeof import("${entrypointPath}").${method};\n`;
                        }

                        finishedRoutesDTS += `  }\n`;
    
                        finishedRoutesDTS += `}`;
                    }

                    if (_injectTypes) {
                        _injectTypes({
                            filename: 'trr-routes.d.ts',
                            content: finishedRoutesDTS,
                        })
                    }
                },
            }
        }
    }
});
