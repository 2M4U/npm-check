const NPM = require("./lib/updateChecker");
const Update = new NPM({
  NPM_PACKAGE: "npmupdatecheck", //automatic defaults to ./package.json
  AUTO_CHECK: true,
  RUN_UPDATE_CHECK: true,
  AUTO_CHECK_TIME: 30,
  AUTO_INSTALL: true // default is false, it allows the script to auto-update the NPM Package and close out.
});
async function test() {
  await Update.check();
}
test();
