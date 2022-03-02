const axios = require("axios");
const prettyMs = require("pretty-ms");
const { exec } = require("child_process");
const { name, version } = require("../package.json");
function escapeShellArg(arg) {
  return `${arg.replace(/'/g, `'\\''`)}`;
};

class UpdateChecker {
  /**
     * 
     * @example
     * NPM({
     *      NPM_PACKAGE: "Project-Example",
            AUTO_CHECK: true,
            RUN_UPDATE_CHECK: true,
            AUTO_CHECK_TIME: 3600, //in seconds
        });
     */
  constructor(options) {
    this.NPM_PACKAGE = options.PROJECT_NAME || require("../package.json").name;
    this.RUN_UPDATE_CHECK = options.RUN_UPDATE_CHECK || true;
    this.AUTO_CHECK = options.AUTO_CHECK || false;
    this.AUTO_CHECK_TIME = options.AUTO_CHECK_TIME || 3600;
    this.AUTO_INSTALL = options.AUTO_INSTALL || false;
  }
  async check() {
    if (this.RUN_UPDATE_CHECK) {
      try {
        let npm_url = "https://registry.npmjs.org/{project}/".replace(
          "{project}",
          this.NPM_PACKAGE
        );
        let npm = await axios.get(npm_url, {
          headers: {
            "user-agent": `${name}/${version} by 2M4U (+https://github.com/2M4U/npm-check)`,
          },
        });

        let current_version = require(`../package.json`).version;
        let bot_version = current_version.replace(/\./g, "");
        let npm_version = npm.data["dist-tags"].latest;
        let tag_name = npm_version.replace(/\./g, "");

        if (isNaN(bot_version) || isNaN(tag_name)) {
          console.log(
            "[Update Checker] Could not parse version numbers. Make sure the package.json file is untouched."
          );
        } else {
          if (Number(tag_name) > Number(bot_version)) {
            if (this.AUTO_INSTALL) {
              console.log(
                "[Update Checker] There is a new version. Auto-Installing Now."
              );
              exec(`npm i ${name}@latest`, (error, stdout, stderr) => {
                if (error) {
                  console.error(`[Update Auto-Install] Error: ${error}`);
                  return;
                }

                if (stderr)
                  return console.error(
                    `[Update Auto-Install] STDERR: ${stderr}`
                  );
                console.log(`[Update Auto-Install]: ${stdout}`);
                process.exit(0);
              });
            } else {
              console.log(
                `[Update Checker] There is a new version. Please run 'npm i ${escapeShellArg(name)}@latest'.`
              );
            }
            console.log(`[Update Checker] Current Version: ${current_version}`);
            console.log(`[Update Checker] New Version: ${npm_version}`);
          } else {
            console.log(
              `[Update Checker] Congratulations, the NPM ${
                require(`../package.json`).name
              } is currently up to date!`
            );
          }
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          console.log(
            `[Update Checker] No releases could be found. Checking again in ${prettyMs(
              this.AUTO_CHECK_TIME * 1000,
              { verbose: true }
            )} for a new update.`
          );
        } else {
          console.log(
            "[Update Checker] There was an error checking for updates."
          );
        }
      }
    }
    if (this.AUTO_CHECK) {
      console.log(
        `[Update Checker] Checking again in ${prettyMs(
          this.AUTO_CHECK_TIME * 1000,
          { verbose: true }
        )} for a new update.`
      );
      setInterval(async () => {
        await new UpdateChecker({
          NPM_PACKAGE: this.NPM_PACKAGE,
          AUTO_CHECK: this.AUTO_CHECK,
          RUN_UPDATE_CHECK: this.RUN_UPDATE_CHECK,
          AUTO_CHECK_TIME: this.AUTO_CHECK_TIME,
          AUTO_INSTALL: this.AUTO_INSTALL
        }).check();
      }, this.AUTO_CHECK_TIME * 1000);
    }
  }
}
module.exports = UpdateChecker;
