import { defineRoute } from "typed-rest-routes/server";
import { z } from "astro/zod";

export const GET = defineRoute({
	handler: (context) => {
		return "[GET]    Query: none, Body: none";
	}
});

export const PUT = defineRoute({
	query: z.object({
		test: z.string({ message: "test is required" }),
	}, { message: "This endpoint needs query parameters (test)" }),
	handler: (context, { test }) => {
		return `[PUT]    Query: ${test}, Body: none`;
	}
});

export const POST = defineRoute({
	query: z.object({
		test: z.string({ message: "test is required" }),
	}, { message: "This endpoint needs query parameters (test)" }),
	schema: z.object({
		id: z.string({ message: "id is required" }),
	}, { message: "This endpoint needs a JSON body with an id key" }),
	handler: (context, { test }, { id }) => {
		return `[POST]   Query: ${test}, Body: ${id}`;
	}
});

export const DELETE = defineRoute({
	schema: z.object({
		id: z.string({ message: "id is required" }),
	}, { message: "This endpoint needs a JSON body with an id key" }),
	handler: (context, query, { id }) => {
		return `[DELETE] Query: none, Body: ${id}`;
	}
});