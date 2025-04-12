---
"typed-rest-routes": minor
---

Adds support for query parameters and optional request bodies.

#### Query Parameters

Previously, you were able to pass any query parameter using the standard `?`-syntax. However, this was unreliable and not type-safe. Now, query parameters can be defined on the server with a schema:

```ts
// /api/index.ts
export const GET = defineRoute({
	query: z.object({
		name: z.string(),
	}),
	handler: (context, { name }) => {
		return `Hello, ${name}!`;
	}
});
```

They can then be passed using the following syntax with `callRoute` on the client:

```ts
// /api/index.ts
callRoute("/api", "GET", { name: "Houston" });
```

Because of this, request bodies have been moved to the 4th parameter in the `callRoute` function. See the [Breaking Changes](#breaking-changes) section for more details.

#### Optional Request Bodies (& Query Parameters)
Both query schemas and body schemas can now be made optional using standard Zod syntax:

```ts
// /api/index.ts
export const GET = defineRoute({
	query: z.object({
		name: z.string(),
	}).optional(),
	schema: z.object({
		id: z.string(),
	}).optional(),
	handler: (context, { name }, { id }) => {
		return `Hello, ${name}! (ID: ${id})`;
	}
});
```

#### Breaking Changes

##### `callRoute`
Due to the addition of query parameter support, the `callRoute` function has been changed to accept the query parameters as the third parameter and the body as the fourth parameter. Please make sure to update your code accordingly if you are using the `callRoute` function with a body:

```diff
-const result = await callRoute("/api/hello", "POST", {
-  name: "Houston"
-});

+const result = await callRoute("/api/hello", "POST", undefined, {
+  name: "Houston"
+});
```

##### `defineRoute`
The `defineRoute` function has been changed to accept the query parameters as the second parameter and the body as the third parameter. Please make sure to update your code accordingly if you are using the `defineRoute` function with a body:

```diff
-export const POST = defineRoute({
-  // ...
-  handler: (context, body) => {
-    return `Hello, ${body.name}!`;
-  }
-});

+export const POST = defineRoute({
+  // ...
+  handler: (context, query, body) => {
+    return `Hello, ${body.name}!`;
+  }
+});
```