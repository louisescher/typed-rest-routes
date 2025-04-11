/**
 * This module contains types for typed-rest-routes
 * @module
 */

import { z } from "astro/zod";
import type { APIRoute } from "astro";

export type HTTPMethod = 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD';
export type GenericResult = BodyInit | null | undefined | any | Array<any> | Response | Promise<BodyInit | null | undefined | any | Array<any> | Response>;

export type RouteDefinition<Schema extends z.ZodTypeAny, Result extends GenericResult> = {
	schema?: Schema;
	handler: (context: Parameters<APIRoute>[0], body: z.infer<Schema>) => Result;
}

export type Endpoint = {
	routeTypeString: string;
	entrypoint: string;
}

export type SSRLoadModuleFn = (url: string, opts?: { fixStacktrace?: boolean | undefined; } | undefined) => Promise<Record<string, any>>;