---
"typed-rest-routes": minor
---

Changes the imports from virtual modules to direct imports. This change allows TRR to work with client-side frameworks like React.

#### Breaking Changes:

When migrating, please make sure to change all client side imports from `trr:client` to `typed-rest-routes/client`, and all server side imports from `trr:server` to `typed-rest-routes/server`:

```diff
-import { callRoute } from "trr:client";
+import { callRoute } from "typed-rest-routes/client";
```

```diff
-import { defineRoute } from "trr:server";
+import { defineRoute } from "typed-rest-routes/server";
```