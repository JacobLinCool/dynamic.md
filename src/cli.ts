#!/usr/bin/env node
import type { File } from "./types";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "fs";
import { basename, dirname, resolve } from "path";
import { program } from "commander";
import chalk from "chalk";
import { dmd } from "./dynamic-md";

const package_json = JSON.parse(readFileSync(resolve(__dirname, "..", "package.json"), "utf8"));

program.version(chalk`${package_json.name} {yellowBright ${package_json.version}}\n${package_json.description}`);

program
    .argument("[paths...]", "files or directories to inject, if none given, will use .mdocs under current directory")
    .option("-o, --output <directory>", "output directory, default is current directory", "")
    .option("-f, --force", "force overwrite existing files")
    .action(async (paths?: string[]) => {
        const output_dir = resolve(process.cwd(), program.opts().output);

        process.stdout.write(chalk`Output directory: {yellowBright ${output_dir}}\n`);

        if (!paths || paths.length === 0) {
            if (!existsSync(resolve(process.cwd(), ".mdocs"))) {
                process.stdout.write(chalk`{bgRedBright Error} .mdocs directory not found.\n`);
                process.stdout.write(chalk`Would you like to create .mdocs under current directory? {yellowBright (y/n)} `);
                if (await wait_for_comfirm()) {
                    mkdirSync(resolve(process.cwd(), ".mdocs"));
                } else {
                    process.exit(1);
                }
            }
            paths = [".mdocs"];
        }

        const start_time = Date.now();

        const targets: File[] = [];
        paths.forEach((path) => {
            const root = resolve(process.cwd(), path);
            const sources = read_recursive(resolve(process.cwd(), path));

            for (const source of sources) {
                const output = source.replace(root, output_dir);
                targets.push({ root, source, output });
            }
        });

        process.stdout.write(chalk`Found {yellowBright ${targets.length}} targets.\n`);

        for (const target of targets) {
            process.stdout.write(chalk`Progress: {yellowBright ${target.source}}\n       -> {yellowBright ${target.output}}\n`);

            if (existsSync(target.output) && !program.opts().force) {
                process.stdout.write(chalk`{yellowBright ${basename(target.output)}} already exists, overwrite? {yellowBright (y/n)} `);
                const ans = await wait_for_comfirm();
                if (!ans) {
                    process.stdout.write(chalk.blueBright("Skipped.\n"));
                    continue;
                }
            }

            const content = readFileSync(target.source, "utf8");
            const injected = await dmd(content);

            if (!existsSync(target.output)) {
                mkdirSync(dirname(target.output), { recursive: true });
            }

            writeFileSync(target.output, injected);
        }

        const time = (Date.now() - start_time) / 1000;

        process.stdout.write(
            chalk`{yellowBright ${targets.length}} Task${targets.length === 1 ? "" : "s"} Finished in {cyanBright ${time}} second${
                time === 1 ? "" : "s"
            }.\n`,
        );
        process.stdin.destroy();
    });

program.parse();

function read_recursive(dir: string): string[] {
    if (!statSync(dir).isDirectory()) {
        return existsSync(dir) ? [dir] : [];
    }

    const files = readdirSync(dir);
    const result: string[] = [];

    for (const file of files) {
        const path = resolve(dir, file);
        const stat = statSync(path);

        if (stat.isDirectory()) {
            result.push(...read_recursive(path));
        } else {
            result.push(path);
        }
    }

    return result;
}

function wait_for_comfirm(): Promise<boolean> {
    return new Promise((resolve) => {
        process.stdin.setEncoding("utf8");
        process.stdin.on("data", (buffer) => {
            const input = buffer.toString().trim().toLowerCase();
            resolve(input === "y" || input === "yes");
        });
    });
}
