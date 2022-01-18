import { readFileSync } from "fs";
import yaml from "js-yaml";
import { dmd } from "../../dynamic-md";

const package_json = JSON.parse(readFileSync("package.json", "utf8"));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lock_yaml = yaml.load(readFileSync("pnpm-lock.yaml", "utf8")) as any;

const markdown = `
# Hello <!-- $ echo "World" -->

123456 + 654321 = <!-- $$ 123456 + 654321 -->

<!-- normal comment -->

## package.json

Version: <!-- % package.json version -->

\`\`\`json
<!-- % package.json -->
\`\`\`

## pnpm-lock.yaml

Lockfile Version: <!-- % pnpm-lock.yaml lockfileVersion -->

\`\`\`yaml
<!-- % pnpm-lock.yaml -->
\`\`\`

## LICENSE

<!-- % LICENSE -->

## Example

\`\`\`md
<!-- X $$ 123 - 123 -->
\`\`\`

\`\`\`md
<!-- X abc -->
\`\`\`
`;

const correct = `
# Hello World

123456 + 654321 = 777777

<!-- normal comment -->

## package.json

Version: ${package_json.version}

\`\`\`json
${JSON.stringify(package_json, null, 4)}
\`\`\`

## pnpm-lock.yaml

Lockfile Version: ${lock_yaml.lockfileVersion}

\`\`\`yaml
${yaml.dump(lock_yaml, { indent: 4 })}
\`\`\`

## LICENSE

${readFileSync("LICENSE", "utf8")}

## Example

\`\`\`md
<!-- $$ 123 - 123 -->
\`\`\`

\`\`\`md
<!-- abc -->
\`\`\`
`;

describe("integration: dmd", () => {
    it("should parse the markdown correctly", async () => {
        const result = await dmd(markdown);
        expect(result).toEqual(correct);
    });
});
