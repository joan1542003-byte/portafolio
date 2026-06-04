import type { Tool } from "../types/project";
import toolsJson from "./tools.json";

export const staticTools = (toolsJson as Tool[]).sort((a, b) => a.order - b.order);
