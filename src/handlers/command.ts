import { execSync } from "child_process";
import { VM } from "vm2";

async function command_handler(args: string[]): Promise<string> {
    try {
        const command = args.join(" ");
        const result = execSync(command, { encoding: "utf8" });
        return result.trim();
    } catch (err) {
        return `<!-- [dynamic.md] $ Error: ${err} -->`;
    }
}

async function js_command_handler(args: string[]): Promise<string> {
    try {
        const code = args.join(" ");
        const vm = new VM({ timeout: 5000 });
        return vm.run(code).toString();
    } catch (err) {
        return `<!-- [dynamic.md] $$ Error: ${err} -->`;
    }
}

const handlers = {
    $: command_handler,
    $$: js_command_handler,
};

export default handlers;
