import type { z } from "astro/zod";
import type { ArgTuple, NonDefinitiveArgs } from "./types";

async function callRoute<
	Route extends keyof TypedRoutes,
	Method extends keyof TypedRoutes[Route],
	Result extends TypedRoutes[Route][Method]['_result']
>(
	...args: ArgTuple<Route, Method>
): Promise<unknown> {
	const [route, method, query, data] = args as NonDefinitiveArgs<
		Route,
		Method,
		z.infer<Parameters<TypedRoutes[Route][Method]>[1]>,
		z.infer<Parameters<TypedRoutes[Route][Method]>[2]>
	>;

	let url = route as string;

	if (query) {
		const queryParams = new URLSearchParams(query as Record<string, string>);
		url += `?${queryParams.toString()}`;
	}

	const result = await fetch(url, {
		method: method as string,
		headers: new Headers({
			"Content-Type": "application/json"
		}),
		body: data ? JSON.stringify(data) : undefined,
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

export { callRoute };