import type { HandlerMap } from "../types";
import FileHandlers from "./file";
import FetchHandlers from "./fetch";
import CommandHandlers from "./command";
import EscapeHandlers from "./escape";

const handlers: HandlerMap = {
    ...FileHandlers,
    ...FetchHandlers,
    ...CommandHandlers,
    ...EscapeHandlers,
};

export default handlers;
