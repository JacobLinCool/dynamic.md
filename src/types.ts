export type ParseTokenType = "purity" | "injection";

export interface ParseToken {
    type: ParseTokenType;
    value: string;
}

export interface File {
    root: string;
    source: string;
    output: string;
}

export type Specifier = "%" | "%MD" | "%JSON" | "%YAML" | "%TXT" | "^" | "^MD" | "^JSON" | "^YAML" | "^TXT" | "$" | "$$" | "X";

export type Handler = (args: string[]) => Promise<string>;

export type HandlerMap = {
    [key in Specifier]: Handler;
};
