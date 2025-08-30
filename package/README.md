# `typed-rest-routes`

An Astro integration that allows for creating type-safe server endpoints.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
	- [Advanced Usage](#advanced-usage)
		- [Custom Errors](#custom-errors)
		- [Custom Responses](#custom-responses)
- [But Why?](#but-why)

## Installation

You can install `typed-rest-routes` (TRR from here on) from npm. It is recommended to use the Astro CLI for this:

```bash
# npm
npx astro add typed-rest-routes

# pnpm
pnpm astro add typed-rest-routes

# yarn
yarn astro add typed-rest-routes
```

Alternatively, you can manually install the package and add it to your `astro.config.mjs` file:

```bash
# npm
npm install typed-rest-routes

# pnpm
pnpm add typed-rest-routes

# yarn
yarn add typed-rest-routes
```

```mjs
// @ts-check
import { defineConfig } from "astro/config";
import typedRestRoutes from 'typed-rest-routes';

// https://astro.build/config
export default defineConfig({
	// ...
	integrations: [
		typedRestRoutes()
	],
});
```

## Usage

TRR aims to keep compatibility with existing [Astro server endpoints](https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes) to provide an experience similar to actions while having full type-safety for normal routes. It is similar to projects like tRPC.

You can use it in any server endpoint to generate a function that you can export like usual. For example, if you want to handle all GET requests to `/api/hello`, you can define your route handler like this:

```ts
// src/pages/api/hello.ts
import { defineRoute } from "typed-rest-routes/server";

export const GET = defineRoute({
	handler: async (context) => {
		return {
			message: "Hello!"
		};
	},
});
```

When used in conjunction with `callRoute`, this setup provides you with autocompleted URLs and methods in client-side scripts:

```ts
import { callRoute } from "typed-rest-routes/client";

async function main() {
	// You will get full type completions here!
	const result = await callRoute("/api/hello", "GET");
}

main();
```

Another advantage of using TRR is that you can define schemas for your routes using [Zod](https://zod.dev). This is helpful when creating handlers that take in data (and works with both GET and POST requests):

```ts
import { defineRoute } from "typed-rest-routes/server";
import { z } from "astro/zod";

export const GET = defineRoute({
	schema: z.object({
		name: z.string()
	}),
	handler: async (context, data) => {
		// `data` is typed and already verified!
		return `Hello, ${data.name}!`;
	},
});

export const POST = defineRoute({
	schema: z.object({
		name: z.string()
	}),
	handler: async (context, data) => {
		// `data` is typed and already verified!
		return `Hello, ${data.name}!`;
	},
});
```

When using `callRoute`, you will then also get access to a third parameter for the data with full type safety:

```ts
import { callRoute } from "typed-rest-routes/client";

async function main() {
	// You will get full type completions here!
	const result = await callRoute("/api/hello", "GET", {
		name: "Houston"
	});
	
	// You will get full type completions here!
	const result = await callRoute("/api/hello", "POST", {
		name: "Houston"
	});
}

main();
```

### Advanced Usage

Since TRR is built on normal server endpoints, the `handler` function you pass to `defineRoute` always has access to the [Astro context](https://docs.astro.build/en/guides/middleware/#the-context-object) as the first parameter. If you define a schema, the second parameter will be the parsed data from the request.

#### Custom Errors

TRR does not automatically generate errors for your schemas as to not cause confusion when "guessing wrong". Instead, you can use Zod to provide your own error messages. Please check [their documentation](https://zod.dev) on how to do so. Please note that the different error messages you can customize depend on the data type. However, in general, you can use the `message` option to provide a generic error message:

```ts

export const POST = defineRoute({
	schema: z.object({
		name: z.string({ message: "The name key must be set to a string!" })
	}, {
		message: "Missing JSON body!"
	}),
	handler: async (context, data) => {
		return `Hello, ${data.name}!`
	},
});
```

#### Custom Responses
You can return any data type from the handler, even a `Response`. TRR will pass all data along to the client and try it's best to give you a parsed output on the client:

```ts
import { defineRoute } from "typed-rest-routes/server";
import { z } from "astro/zod";

export const POST = defineRoute({
	schema: z.object({
		name: z.string()
	}),
	handler: async (context, body) => {
		return new Response(`Hello, ${body.name}!`, {
			status: 200,
			headers: {
				"x-my-custom-header": "some-value"
			}
		});
	},
});
```

## But Why?

The advantage TRR gives you over Astro actions is that you can define them at any route you'd like. This is quite advantageous when you are creating a public API that you want to use yourself, since actions get generated at the `/_actions` path, which may not be what you want. Using TRR, you can define the routes you want the API to be located at yourself.