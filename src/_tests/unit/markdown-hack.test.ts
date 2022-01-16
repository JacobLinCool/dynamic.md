import { parse } from "../../dynamic-md";

describe("dynamic.md", () => {
    describe("parse", () => {
        it("should parse a simple string", () => {
            const tokens = parse("Hello world!");
            expect(tokens).toEqual([{ type: "purity", value: "Hello world!" }]);
        });

        it("should parse a string with a single injection", () => {
            const tokens = parse("Hello <!-- world -->!");
            expect(tokens).toEqual([
                { type: "purity", value: "Hello " },
                { type: "injection", value: "world" },
                { type: "purity", value: "!" },
            ]);
        });

        it("should parse a string with multiple single word injections", () => {
            const tokens = parse("Hello <!-- world --> and <!-- universe -->!");
            expect(tokens).toEqual([
                { type: "purity", value: "Hello " },
                { type: "injection", value: "world" },
                { type: "purity", value: " and " },
                { type: "injection", value: "universe" },
                { type: "purity", value: "!" },
            ]);
        });

        it("should parse a string with multiple multi-words injections", () => {
            const tokens = parse("Hello <!-- cool world --> and <!-- beautiful universe -->!");
            expect(tokens).toEqual([
                { type: "purity", value: "Hello " },
                { type: "injection", value: "cool world" },
                { type: "purity", value: " and " },
                { type: "injection", value: "beautiful universe" },
                { type: "purity", value: "!" },
            ]);
        });
    });
});
