/**
 * This module contains types for typed-rest-routes
 * @module
 */

import type { z } from "astro/zod";
import type { APIRoute } from "astro";

/** All valid HTTP methods for server endpoints */
export type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD';

/** A generic result that is returned by a handler */
export type GenericResult = BodyInit | null | undefined | any | Array<any> | Response | Promise<BodyInit | null | undefined | any | Array<any> | Response>;

/** A generic handler function definition */
export type HandlerFunction<Q, B, R> = (context: Parameters<APIRoute>[0], query: Q, body: B) => R;

/** The type for a server endpoint. */
export type EndpointDefinition<QuerySchema extends z.ZodTypeAny, Schema extends z.ZodTypeAny, Result extends GenericResult> = {
	query?: QuerySchema;
	schema?: Schema;
	handler: HandlerFunction<z.infer<QuerySchema>, z.infer<Schema>, Result>;
}

/** An internal type for an endpoint. Used to generate the types for all routes. */
export type Endpoint = {
	routeTypeString: string;
	entrypoint: string;
}

/** Vite's ssrLoadModule function as a type. */
export type SSRLoadModuleFn = (url: string, opts?: { fixStacktrace?: boolean | undefined; } | undefined) => Promise<Record<string, any>>;

/** The thing that defineRoute returns. */
export type WrappedAPIRoute<QuerySchema extends z.ZodTypeAny, Schema extends z.ZodTypeAny> = HandlerFunction<QuerySchema, Schema, Response>;

/** A helper for generating function overloads. Used for callRoute to ensure that the correct types are used. */
export type ArgTuple<
	Route extends keyof TypedRoutes,
	Method extends keyof TypedRoutes[Route],
	Query = z.infer<Parameters<TypedRoutes[Route][Method]>[1]>,
	Data = z.infer<Parameters<TypedRoutes[Route][Method]>[2]>
> =
	undefined extends Query
		? undefined extends Data
			? [url: Route, method: Method] // No query, no data
			: [url: Route, method: Method, query: undefined, data: Data] // No query, has data
		: undefined extends Data
			? [url: Route, method: Method, query: Query] // Has query, no data
			: [url: Route, method: Method, query: Query, data: Data]; // Has both

/** The type used when destructuring the arguments to `callRoute` */
export type NonDefinitiveArgs<T, U, V, W> = [url: T, method: U, query: V, data: W] | [url: T, method: U, query: V] | [url: T, method: U];