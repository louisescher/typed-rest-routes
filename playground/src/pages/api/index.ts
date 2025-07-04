import { defineRoute } from "typed-rest-routes/server";
import { z } from "astro/zod";

export const GET = defineRoute({
	schema: z.object({
		id: z.string({ message: "id is required" }),
	}, { message: "This endpoint needs query parameters (id)" }),
	handler: (context, { id }) => {
		return new Response(JSON.stringify({ test: true }), { status: 200 });
	}
});

export const PUT = defineRoute({
	handler: (context) => {
		return `[PUT]    Data: (None)`;
	}
});

export const POST = defineRoute({
	schema: z.object({
		id: z.string({ message: "id is required" }),
	}, { message: "This endpoint needs a JSON body with an id key" }),
	handler: (context, { id }) => {
		return `[POST]   Data: ${id}`;
	}
});

export const DELETE = defineRoute({
	schema: z.object({
		id: z.string({ message: "id is required" }),
	}, { message: "This endpoint needs a JSON body with an id key" }),
	handler: (context, { id }) => {
		return `[DELETE] Data: ${id}`;
	}
});