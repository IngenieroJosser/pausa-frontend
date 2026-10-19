import { createServer } from "node:http";
import { join } from "node:path";
import { createAssessmentService } from "./assessment-service.mjs";
import { createDatabase } from "./database.mjs";
import { createHttpHandler } from "./http-app.mjs";

const PORT = Number(process.env.PORT || 3101);
const HOST = process.env.HOST || "0.0.0.0";
const databasePath = process.env.DATABASE_PATH || join(import.meta.dirname, "data", "pausa.sqlite");
const database = createDatabase(databasePath);
const service = createAssessmentService(database);
const server = createServer(createHttpHandler(service));

server.listen(PORT, HOST, () => {
  console.log(`PAUSA Learning API lista en http://${HOST}:${PORT}`);
});

function shutdown() {
  server.close(() => {
    database.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
