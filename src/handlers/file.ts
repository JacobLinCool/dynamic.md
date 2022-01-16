import { resolve, basename } from "path";
import { readFileSync } from "fs";
import yaml from "js-yaml";
import { deep_find } from "../utils";
import { dmd } from "../dynamic-md";

async function file_handler(args: string[]): Promise<string> {
    switch (basename(args[0].toLowerCase()).split(".")[1]) {
        case "md":
            return file_md_handler(args);
        case "json":
            return file_json_handler(args);
        case "yaml":
        case "yml":
            return file_yaml_handler(args);
        default:
            return file_txt_handler(args);
    }
}

async function file_md_handler(args: string[]): Promise<string> {
    try {
        const path = resolve(process.cwd(), args[0]);
        const content = readFileSync(path, "utf8");
        const result = await dmd(content);
        return result;
    } catch (err) {
        return `<!-- [dynamic.md] %MD Error: ${err} -->`;
    }
}

async function file_json_handler(args: string[]): Promise<string> {
    try {
        const path = resolve(process.cwd(), args[0]);
        const key = args[1] || ".";
        const indent = parseInt((args[2] || "").replace(/\D/g, "")) || 4;

        const content = readFileSync(path, "utf8");
        const json = JSON.parse(content);
        const target = key === "." ? json : deep_find(json, key);
        if (typeof target === "string" || typeof target === "number" || typeof target === "boolean" || target === null) {
            return target.toString();
        }
        return JSON.stringify(target, null, indent);
    } catch (err) {
        return `<!-- [dynamic.md] %JSON Error: ${err} -->`;
    }
}

async function file_yaml_handler(args: string[]): Promise<string> {
    try {
        const path = resolve(process.cwd(), args[0]);
        const key = args[1] || ".";
        const indent = parseInt((args[2] || "").replace(/\D/g, "")) || 4;

        const content = readFileSync(path, "utf8");
        const yml = yaml.load(content);
        const target = key === "." ? yml : deep_find(yml, key);
        if (typeof target === "string" || typeof target === "number" || typeof target === "boolean" || target === null) {
            return target.toString();
        }
        return yaml.dump(target, { indent });
    } catch (err) {
        return `<!-- [dynamic.md] %YAML Error: ${err} -->`;
    }
}

async function file_txt_handler(args: string[]): Promise<string> {
    try {
        const path = resolve(process.cwd(), args[0]);
        const content = readFileSync(path, "utf8");
        return content;
    } catch (err) {
        return `<!-- [dynamic.md] %TXT Error: ${err} -->`;
    }
}

const handlers = {
    "%": file_handler,
    "%MD": file_md_handler,
    "%JSON": file_json_handler,
    "%YAML": file_yaml_handler,
    "%TXT": file_txt_handler,
};

export default handlers;
