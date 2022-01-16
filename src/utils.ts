// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deep_find(obj: any, path: string): any {
    const parts = path.split(".");
    let current = obj;

    if (parts.length === 1 && parts[0] === "") {
        return current;
    }

    for (const part of parts) {
        if (current[part] === undefined) {
            return undefined;
        }

        current = current[part];
    }

    return current;
}
