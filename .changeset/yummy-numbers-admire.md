---
"typed-rest-routes": minor
---

Changes the client-side import from a virtual module to a direct import. This change allows TRR to work with client-side frameworks like React.

#### Breaking Changes:

When migrating, please make sure to change all imports from `trr:client` to `typed-rest-routes/client`:

```diff
-import { callRoute } from "trr:client";
+import { callRoute } from "typed-rest-routes/client";
```