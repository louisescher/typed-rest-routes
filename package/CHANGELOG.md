# typed-rest-routes

## 0.2.8

### Patch Changes

- [`ccc7c63`](https://github.com/louisescher/typed-rest-routes/commit/ccc7c6340e961a033b832a02ba014af7f3a4aa74) Thanks [@louisescher](https://github.com/louisescher)! - Fixes two issues, related to endpoints from other integrations and wrong serialization.

## 0.2.7

### Patch Changes

- [#30](https://github.com/louisescher/typed-rest-routes/pull/30) [`026b29d`](https://github.com/louisescher/typed-rest-routes/commit/026b29d2f14bd58184888fd64208b8bc30b4f7b8) Thanks [@louisescher](https://github.com/louisescher)! - Fixes an issue where responses would have an invalid return type

- [#28](https://github.com/louisescher/typed-rest-routes/pull/28) [`56f5f61`](https://github.com/louisescher/typed-rest-routes/commit/56f5f61e14a9c68d1618f3a420141f098a485348) Thanks [@louisescher](https://github.com/louisescher)! - TRR now attempts to safely parse JSON from a response if no content-type header is present. If that fails, text is returned.

## 0.2.6

### Patch Changes

- [#26](https://github.com/louisescher/typed-rest-routes/pull/26) [`78a287b`](https://github.com/louisescher/typed-rest-routes/commit/78a287bd07e24a7a90f2bd17e608b7b2b43ee03f) Thanks [@louisescher](https://github.com/louisescher)! - Fixes nested objects in GET requests being relayed as "[object Object]"

## 0.2.5

### Patch Changes

- [#24](https://github.com/louisescher/typed-rest-routes/pull/24) [`c1a8e13`](https://github.com/louisescher/typed-rest-routes/commit/c1a8e13d926006fcf38eee161f4c91c3e276f34a) Thanks [@louisescher](https://github.com/louisescher)! - Fixes invalid return types from the `callRoute` function

## 0.2.4

### Patch Changes

- [#22](https://github.com/louisescher/typed-rest-routes/pull/22) [`930466a`](https://github.com/louisescher/typed-rest-routes/commit/930466aa2789c4674e6418e3bdcfd795230d3612) Thanks [@louisescher](https://github.com/louisescher)! - Fixes get requests with a schema not being able to send data by replacing the body implementation with query parameters.

## 0.2.3

### Patch Changes

- [#20](https://github.com/louisescher/typed-rest-routes/pull/20) [`8dcbd90`](https://github.com/louisescher/typed-rest-routes/commit/8dcbd906f5c664c9f47b5a6f03eab34e453b6726) Thanks [@louisescher](https://github.com/louisescher)! - Fixes invalid `context` and `body` types in the handler definiton of the `defineRoute` function

## 0.2.2

### Patch Changes

- [#18](https://github.com/louisescher/typed-rest-routes/pull/18) [`680a903`](https://github.com/louisescher/typed-rest-routes/commit/680a90304cb0f5c5eb4ff297613926660bd42db8) Thanks [@louisescher](https://github.com/louisescher)! - Adds a README to the package to be displayed on npm

## 0.2.1

### Patch Changes

- [#16](https://github.com/louisescher/typed-rest-routes/pull/16) [`dfc8d7a`](https://github.com/louisescher/typed-rest-routes/commit/dfc8d7ac072e1a18eb67ed37b180981f04c6330a) Thanks [@louisescher](https://github.com/louisescher)! - Fixes an issue where sending a request with the wrong body would cause an internal server error.

## 0.2.0

### Minor Changes

- [#14](https://github.com/louisescher/typed-rest-routes/pull/14) [`9355616`](https://github.com/louisescher/typed-rest-routes/commit/9355616430d12be2ed318d1a039f6bcb68344814) Thanks [@louisescher](https://github.com/louisescher)! - Changes the imports from virtual modules to direct imports. This change allows TRR to work with client-side frameworks like React.

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

## 0.1.5

### Patch Changes

- [`47b28ca`](https://github.com/louisescher/typed-rest-routes/commit/47b28ca68ede553d7a10747e8649f355d461ce8f) Thanks [@louisescher](https://github.com/louisescher)! - Fixes a potential request body read error

## 0.1.4

### Patch Changes

- [#10](https://github.com/louisescher/typed-rest-routes/pull/10) [`bbf0f9e`](https://github.com/louisescher/typed-rest-routes/commit/bbf0f9e9950e6c11433bcafcd0b57ac184a90574) Thanks [@Adammatthiesen](https://github.com/Adammatthiesen)! - Modify typed route generation to automatically get the astro project root instead of relying on relative path

- [#11](https://github.com/louisescher/typed-rest-routes/pull/11) [`6043569`](https://github.com/louisescher/typed-rest-routes/commit/604356954c6cf49c7c7a39b9de86687a577bc931) Thanks [@louisescher](https://github.com/louisescher)! - Refactors the integration with better error handling and support for HMR. Also fixes parsing issues.

## 0.1.3

### Patch Changes

- [#8](https://github.com/louisescher/typed-rest-routes/pull/8) [`1312b81`](https://github.com/louisescher/typed-rest-routes/commit/1312b81f564653390b1f1394ce32a6de5f51aae0) Thanks [@louisescher](https://github.com/louisescher)! - Fixes types for query parameters and allows for passing custom zod errors

## 0.1.2

### Patch Changes

- [`9a93136`](https://github.com/louisescher/typed-rest-routes/commit/9a93136c98739210f52eb960566cf7296c5782cd) Thanks [@louisescher](https://github.com/louisescher)! - Fixes route types not being autocompleted

## 0.1.1

### Patch Changes

- [#5](https://github.com/louisescher/typed-rest-routes/pull/5) [`10b67c8`](https://github.com/louisescher/typed-rest-routes/commit/10b67c8e4a8cd0de8e717e35e05c45ab173da5fc) Thanks [@louisescher](https://github.com/louisescher)! - Fixes client-side types not working as intended on Linux

## 0.1.0

### Minor Changes

- [#2](https://github.com/louisescher/typed-rest-routes/pull/2) [`c6f74f7`](https://github.com/louisescher/typed-rest-routes/commit/c6f74f7ba77dc1b0089294b44294a5673ab14aaf) Thanks [@louisescher](https://github.com/louisescher)! - Initial Release
