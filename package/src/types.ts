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
export type HandlerFunction<B, R> = (context: Parameters<APIRoute>[0], body: B) => R;

/** The type for a server endpoint. */
export type EndpointDefinition<Schema extends z.ZodTypeAny, Result extends GenericResult> = {
	schema?: Schema;
	handler: HandlerFunction<z.infer<Schema>, Result>;
}

/** An internal type for an endpoint. Used to generate the types for all routes. */
export type Endpoint = {
	routeTypeString: string;
	entrypoint: string;
}

/** Vite's ssrLoadModule function as a type. */
export type SSRLoadModuleFn = (url: string, opts?: { fixStacktrace?: boolean | undefined; } | undefined) => Promise<Record<string, any>>;

/** The thing that defineRoute returns. */
export type WrappedAPIRoute<Schema extends z.ZodTypeAny> = HandlerFunction<Schema, Response>;

/** The type used when destructuring the arguments to `callRoute` */
export type NonDefinitiveArgs<T, U, V> = [url: T, method: U, data: V] | [url: T, method: U];