import { defineRoute } from "trr:server";
import { z } from "astro/zod";

export const GET = defineRoute({
	handler: (context) => {
		return "Hello World!";
	}
});

export const POST = defineRoute({
	schema: z.object({
		id: z.string({ required_error: "id is required" }),
	}),
	handler: (context, { id }) => {
		return `Hello, ${id}!`;
	}
});