import { makeContext } from "../lib/utils";
import { schema } from "./schema";

export const context = makeContext({ context: {}, schema });
