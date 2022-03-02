## Example Usage

The script below will check [\***\*THIS\*\***](https://npmjs.com/npm-check) exact NPM repository for it's release version,
I will be improving this at a later date when I can find the time.

```js
const NPM = require("npmupdatecheck");
const Update = new NPM({
  NPM_PACKAGE: "npmupdatecheck", //automatic defaults to ./package.json
  AUTO_CHECK: true,
  RUN_UPDATE_CHECK: true,
  AUTO_CHECK_TIME: 30,
  AUTO_INSTALL: true, // default is false, it allows the script to auto-update the NPM Package and close out.
});
```
