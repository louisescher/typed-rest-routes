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

export { callRoute };