import type { z } from "astro/zod";
import type { GenericResult, EndpointDefinition, WrappedAPIRoute } from "./types";
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
 * @returns - The parsed body or false if it fails.
 */
async function bruteForceRequestBody(request: Request, iterations: number = 0): Promise<unknown | false> {
	if (iterations > 4) {
		return false;
	}
	
	try {
		const cloned = request.clone();

		switch (iterations) {
			case 0:
				return await cloned.json();
			case 1:
				return await cloned.formData();
			case 2:
				return await cloned.text();
			case 3:
				return await cloned.blob();
			case 4:
				return await cloned.arrayBuffer();
			default:
				return false;
		}
	} catch (e) {
		const body = await bruteForceRequestBody(request, iterations + 1);
		return body;
	}
}

function defineRoute<
	Schema extends z.ZodTypeAny = z.ZodUndefined,
	Result extends GenericResult = undefined
>(
	{ schema, handler }: EndpointDefinition<Schema, Result>
): WrappedAPIRoute<Schema> & { _result: Result } {
	// @ts-expect-error - Type black magic. Not actually used (lmao)
	return async (context) => {
		if (!schema) {
			let result: GenericResult = await handler(context, undefined);

			return handleHandlerResponse(result);
		}
		
		let data: any | false = undefined;
		
		if (context.request.method === "GET") {
			data = context.url.searchParams.size > 0 ? Object.fromEntries(context.url.searchParams.entries()) : undefined;
		} else {
			data = await bruteForceRequestBody(context.request);
		}

		if (data === false) {
			return new Response("Unsupported request body", { status: 400 });
		}

		const result = schema.safeParse(data || undefined);

		if (!result.success) {
			return new Response(result.error.issues[0].message, { status: 400 });
		}

		let handlerRes: GenericResult = await handler(context, result.data);

		return handleHandlerResponse(handlerRes);
	};
}

export { defineRoute };