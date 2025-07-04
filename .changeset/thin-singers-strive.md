---
"typed-rest-routes": patch
---

TRR now attempts to safely parse JSON from a response if no content-type header is present. If that fails, text is returned.
