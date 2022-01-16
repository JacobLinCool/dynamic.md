import { deep_find } from "../../utils";

describe("utils", () => {
    describe("deep_find", () => {
        it("should return the value at the given path", () => {
            const obj = { a: { b: { c: "hello" } } };
            expect(deep_find(obj, "a.b.c")).toEqual("hello");
        });

        it("should return undefined if the path does not exist", () => {
            const obj = { a: { b: { c: "hello" } } };
            expect(deep_find(obj, "a.b.d")).toBeUndefined();
        });

        it("should return the object itself if the path is empty", () => {
            const obj = { a: { b: { c: "hello" } } };
            expect(deep_find(obj, "")).toEqual(obj);
        });
    });
});
