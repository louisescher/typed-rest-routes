import type { z } from "astro/zod";
import type { GenericResult, RouteDefinition } from "./types";
import type { APIRoute } from "astro";

/**
 * Generates a content type for a given result.
 * @param result - The result to generate a content type for.
 * @returns - The content type for the result.
 */
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

/**
 * Handles the response from a handler.
 * @param result - The result from the handler.
 * @returns - The appropriate response.
 */
function handleHandlerResponse(result: GenericResult): Response {
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

/**
 * Brute forces the request body to find the correct type. Used since we can't rely on a correct header being provided.
 * @param request - The request to brute force.
 * @param iterations - The number of iterations to try.
 * @returns 
 */
async function bruteForceRequestBody(request: Request, iterations: number = 0): Promise<unknown | false> {
	if (iterations > 4) {
		return false;
	}
	
	try {
		const cloned = request.clone();

		switch (iterations) {
			case 0:
				return cloned.json();
			case 1:
				return cloned.formData();
			case 2:
				return cloned.arrayBuffer();
			case 3:
				return cloned.blob();
			case 4:
				return cloned.text();
			default:
				return false;
		}
	} catch (e) {
		return bruteForceRequestBody(request, iterations + 1);
	}
}

type WrappedAPIRoute<Schema extends z.ZodTypeAny> = (context: Parameters<APIRoute>[0], schema: Schema) => Response

function defineRoute<
	Schema extends z.ZodTypeAny = z.ZodUndefined,
	Result extends GenericResult = undefined
>(
	{ schema, handler }: RouteDefinition<Schema, Result>
): WrappedAPIRoute<Schema> & { _result: Result } {
	// @ts-expect-error - Type black magic. Not actually used (lmao)
	return async (context) => {
		if (!schema) {
			let result: GenericResult = await handler(context, undefined);

			return handleHandlerResponse(result);
		}
		
		let reqBody = await bruteForceRequestBody(context.request);

		if (reqBody === false) {
			return new Response("Unsupported request body", { status: 400 });
		}

		const result = schema.safeParse(reqBody);

		if (!result.success) {
			return new Response(result.error.issues[0].message, { status: 400 });
		}

		let handlerRes: GenericResult = await handler(context, result.data);

		return handleHandlerResponse(handlerRes);
	};
}

/**
 * A mock type for the generated TypedRoutes interface.
 */
interface TypedRoutes {
	[route: string]: {
		[method: string]: (...args: any[]) => Response & { _result: any };
	};
}

async function callRoute<
	Route extends keyof TypedRoutes,
	Method extends keyof TypedRoutes[Route],
	Data extends Parameters<TypedRoutes[Route][Method]>[1],
	Result extends ReturnType<TypedRoutes[Route][Method]>['_result']
>(
	url: Route,
	method: Method,
	data: Data,
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