import type { z } from "astro/zod";
import type { NonDefinitiveArgs } from "./types";

async function callRoute<
	Route extends keyof TypedRoutes,
	Method extends keyof TypedRoutes[Route],
	Data extends z.infer<Parameters<TypedRoutes[Route][Method]>[1]>,
	Result extends TypedRoutes[Route][Method]['_result']
>(
	...args: (Data extends undefined 
		? [route: Route, method: Method] 
		: [route: Route, method: Method, data: Data]
	)
): Promise<Result> {
	let [route, method, data] = args as NonDefinitiveArgs<Route, Method, Data>;

	let url = route as string;

	const useQueryParams = method === "GET" || method === "HEAD";

	if (data) {
		for (const [key, value] of Object.entries(data || {})) {
			if (typeof value === "object" && value !== null) {
				data[key] = JSON.stringify(value);
			}
		}
	}

	if ((method === "GET" || method === "HEAD") && !!data) {
		const queryParams = new URLSearchParams(data);
		url += `?${queryParams.toString()}`;
	}

	const result = await fetch(url, {
		method: method as string,
		headers: new Headers({
			"Content-Type": "application/json"
		}),
		body: !!data && !useQueryParams ? JSON.stringify(data) : undefined,
	});

	const cTypeHeader = result.headers.get("content-type");

	if (cTypeHeader?.startsWith("application/json")) {
		return result.json() as Promise<Result>;
	} else if (cTypeHeader?.startsWith("text/plain")) {
		return result.text() as Promise<Result>;
	} else if (cTypeHeader?.startsWith("application/octet-stream")) {
		return result.blob() as Promise<Result>;
	} else {
		try {
			const json = await result.json() as Promise<Result>;
			return json;
		} catch(err) {
			return result.text() as Promise<Result>;
		}
	}
}

export { callRoute };