import type { z } from "astro/zod";
import type { GenericResult, RouteDefinition } from "./types";

function generateContentType(result: GenericResult): string {
	if (typeof result === "string") {
		return "text/plain";
	}

	if (result instanceof Blob || result instanceof ArrayBuffer) {
		return "application/octet-stream";
	}

	if (typeof result === "object") {
		return "application/json";
	}

	if (typeof result === "number") {
		return "text/plain";
	}

	return "text/plain";
}

function defineRoute<
	Schema extends z.ZodTypeAny = z.ZodUndefined,
	Result extends GenericResult = undefined
>(
	{ schema, handler }: RouteDefinition<Schema, Result>
): (schema: z.infer<Schema>) => Response & {  _result: Result } {
	// @ts-expect-error - Type black magic. Not actually used (lmao)
	return (async (context) => {
		if (!schema) {
			let result: GenericResult = await handler(context, undefined);

			if (!result) {
				return new Response("No content", { status: 204 });
			}
			
			if (result instanceof Response) {
				return result;
			}

			const contentType = generateContentType(result);

			if (typeof result === "object" && result !== null) {
				result = JSON.stringify(result);
			}

			return new Response(result, {
				status: 200,
				headers: new Headers({
					"Content-Type": contentType,
				})
			});
		}
		
		const reqBody = await context.request.json();
		const result = schema.safeParse(reqBody);

		if (!result.success) {
			return new Response("Invalid request", { status: 400 });
		}

		let handlerRes: GenericResult = await handler(context, result.data);

		if (!handlerRes) {
			return new Response("No content", { status: 204 });
		}
		
		if (handlerRes instanceof Response) {
			return handlerRes;
		}
			
		const contentType = generateContentType(handlerRes);

		if (typeof handlerRes === "object" && handlerRes !== null) {
			handlerRes = JSON.stringify(handlerRes);
		}

		return new Response(handlerRes, {
			status: 200,
			headers: new Headers({
				"Content-Type": contentType,
			})
		});
	});
}

interface TypedRoutes {
	[route: string]: {
		[method: string]: (...args: any[]) => Response & { _result: any };
	};
}

async function callRoute<
	Route extends keyof TypedRoutes,
	Method extends keyof TypedRoutes[Route],
	Result extends ReturnType<TypedRoutes[Route][Method]>['_result']
>(
	url: Route,
	method: Method,
	data: Parameters<TypedRoutes[Route][Method]>[0]
): Promise<Result> {
	const result = await fetch(url as string, {
		method: method as string,
		headers: new Headers({
			"Content-Type": "application/json"
		}),
		body: JSON.stringify(data),
	});

	const cTypeHeader = result.headers.get("content-type");

	if (cTypeHeader?.startsWith("application/json")) {
		return result.json() as Promise<Result>;
	} else if (cTypeHeader?.startsWith("text/plain")) {
		return result.text() as Promise<Result>;
	} else if (cTypeHeader?.startsWith("application/octet-stream")) {
		return result.blob() as Promise<Result>;
	} else {
		return result.text() as Promise<Result>;
	}
}

export { defineRoute, callRoute };