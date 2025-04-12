import { defineRoute } from "typed-rest-routes/server";
import { z } from "astro/zod";

export const GET = defineRoute({
	handler: (context) => {
		return "Hello World!";
	}
});

export const POST = defineRoute({
	schema: z.object({
		id: z.string({ message: "id is required" }),
	}),
	handler: (context, { id }) => {
		return `Hello, ${id}!`;
	}
});