import { basename } from "path";
import fetch from "node-fetch";
import yaml from "js-yaml";
import { deep_find } from "../utils";

async function fetch_handler(args: string[]): Promise<string> {
    switch (basename(args[0].toLowerCase()).split(".")[1]) {
        case "md":
            return fetch_md_handler(args);
        case "json":
            return fetch_json_handler(args);
        case "yaml":
        case "yml":
            return fetch_yaml_handler(args);
        default:
            return fetch_txt_handler(args);
    }
}

async function fetch_md_handler(args: string[]): Promise<string> {
    try {
        if (process.env.MARKDOWN_HACK_REMOTE_EXECUTE !== "true") {
            return fetch_txt_handler(args);
        }
        const res = await fetch(args[0]);
        const content = await res.text();
        return content;
    } catch (err) {
        return `<!-- [Markdown Hack] ^MD Error: ${err} -->`;
    }
}

async function fetch_json_handler(args: string[]): Promise<string> {
    try {
        const key = args[1] || ".";
        const indent = parseInt((args[2] || "").replace(/\D/g, "")) || 4;

        const res = await fetch(args[0]);
        const json = await res.json();
        const target = key === "." ? json : deep_find(json, key);
        if (typeof target === "string" || typeof target === "number" || typeof target === "boolean" || target === null) {
            return target.toString();
        }
        return JSON.stringify(target, null, indent);
    } catch (err) {
        return `<!-- [Markdown Hack] ^JSON Error: ${err} -->`;
    }
}

async function fetch_yaml_handler(args: string[]): Promise<string> {
    try {
        const key = args[1] || ".";
        const indent = parseInt((args[2] || "").replace(/\D/g, "")) || 4;

        const res = await fetch(args[0]);
        const content = await res.text();
        const yml = yaml.load(content);
        const target = key === "." ? yml : deep_find(yml, key);
        if (typeof target === "string" || typeof target === "number" || typeof target === "boolean" || target === null) {
            return target.toString();
        }
        return yaml.dump(target, { indent });
    } catch (err) {
        return `<!-- [Markdown Hack] ^YAML Error: ${err} -->`;
    }
}

async function fetch_txt_handler(args: string[]): Promise<string> {
    try {
        const res = await fetch(args[0]);
        const content = await res.text();
        return content;
    } catch (err) {
        return `<!-- [Markdown Hack] ^TXT Error: ${err} -->`;
    }
}

const handlers = {
    "^": fetch_handler,
    "^MD": fetch_md_handler,
    "^JSON": fetch_json_handler,
    "^YAML": fetch_yaml_handler,
    "^TXT": fetch_txt_handler,
};

export default handlers;
