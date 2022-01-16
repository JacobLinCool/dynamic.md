import type { ParseToken } from "./types";
import { interpreter } from "./interpreter";

export async function dmd(content: string): Promise<string> {
    const tokens = parse(content);
    const injected = await inject(tokens);
    return injected;
}

export function parse(content: string): ParseToken[] {
    const purity = content.split(/<!--\s*.*?\s*-->/g);
    const injections = [...content.matchAll(/<!--\s*(.*?)\s*-->/g)].map((match) => match[1]) || [];

    const parsed: ParseToken[] = [];
    for (let i = 0; i < purity.length - 1; i++) {
        parsed.push({ type: "purity", value: purity[i] });
        parsed.push({ type: "injection", value: injections[i] });
    }
    parsed.push({ type: "purity", value: purity[purity.length - 1] });

    return parsed;
}

export async function inject(tokens: ParseToken[]): Promise<string> {
    const promises = tokens.map(async (token) => {
        if (token.type === "injection") {
            return await interpreter(token.value);
        } else {
            return token.value;
        }
    });

    const injected = await Promise.all(promises);
    return injected.join("");
}
