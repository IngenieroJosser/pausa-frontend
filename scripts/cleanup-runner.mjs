import { createJiti } from "jiti";
await createJiti(import.meta.url).import("./cleanup.ts");
