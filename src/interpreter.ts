import type { Specifier } from "./types";
import handlers from "./handlers";

const specifiers = Object.keys(handlers) as Specifier[];

export async function interpreter(command: string): Promise<string> {
    const regex = /(?<=")[^"]*(?=")|[^" ]+/g;
    const args = (command.match(regex) || []).map((arg) => arg.trim());
    const specifier = (args.shift() || "").toUpperCase() as Specifier;

    if (specifiers.includes(specifier)) {
        try {
            return await handlers[specifier](args);
        } catch (err) {
            return `<!-- [dynamic.md] Handler ${specifier} Error: ${err} -->`;
        }
    } else {
        return `<!-- ${command} -->`;
    }
}
