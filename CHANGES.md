## [2.4.2]

- Fix bundling with Browserify

[2.4.2]: https://github.com/mjackson/http-client/compare/v2.4.0...v2.4.2

## [2.4.0]
> Mar 18, 2016

- Export `handleResponse` helper for building middleware
- Fixed `browser` field in package config

[2.4.0]: https://github.com/mjackson/http-client/compare/v2.3.0...v2.4.0

## [2.3.0]
> Mar 14, 2016

- Add callback support to all `fetch` methods
- **Breakage:** Use `requestInput` property instead of `requestURL` in `requestInfo`
  middleware

[2.3.0]: https://github.com/mjackson/http-client/compare/v2.2.1...v2.3.0

## [2.2.1]
> Mar 13, 2016

- Move UMD build from `umd/HTTPClient.js` to `umd/http-client.js`
- **Bugfix:** Do not append empty URL when using `base` middleware

[2.2.1]: https://github.com/mjackson/http-client/compare/v2.2.0...v2.2.1
