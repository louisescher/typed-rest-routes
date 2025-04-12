# typed-rest-routes

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
