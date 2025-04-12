import { defineRoute } from "typed-rest-routes/server";
import { z } from "astro/zod";

export const GET = defineRoute({
	schema: z.object({
		id: z.string({ message: "id is required" }),
	}, { message: "This endpoint needs query parameters (id)" }),
	handler: (context, { id }) => {
		return `[GET]    Body: ${id}`;
	}
});

export const PUT = defineRoute({
	handler: (context) => {
		return `[PUT]    Body: (None)`;
	}
});

export const POST = defineRoute({
	schema: z.object({
		id: z.string({ message: "id is required" }),
	}, { message: "This endpoint needs a JSON body with an id key" }),
	handler: (context, { id }) => {
		return `[POST]   Body: ${id}`;
	}
});

export const DELETE = defineRoute({
	schema: z.object({
		id: z.string({ message: "id is required" }),
	}, { message: "This endpoint needs a JSON body with an id key" }),
	handler: (context, { id }) => {
		return `[DELETE] Body: ${id}`;
	}
});