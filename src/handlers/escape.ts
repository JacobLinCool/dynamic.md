async function escape_handler(args: string[]): Promise<string> {
    return "<!-- " + args.join(" ") + " -->";
}

const handlers = {
    X: escape_handler,
};

export default handlers;
