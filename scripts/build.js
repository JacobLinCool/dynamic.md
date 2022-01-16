/* eslint-disable */
const { spawnSync } = require("child_process");

spawnSync(`npm run format`, { stdio: "inherit", shell: true });
spawnSync(`tsup`, { stdio: "inherit", shell: true });
spawnSync(`npx esbuild node_modules/vm2/lib/contextify.js --bundle --minify --platform=node --outfile=lib/contextify.js`, {
    stdio: "inherit",
    shell: true,
});
