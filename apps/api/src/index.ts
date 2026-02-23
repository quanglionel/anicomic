import { Hono } from "hono";
import { API_VERSION } from "./config";
import { registerMiddleware } from "./middleware";
import { registerContentRoutes } from "./routes/content";
import { registerParserRoutes } from "./routes/parser";
import { registerPluginRoutes } from "./routes/plugins";
import { registerSystemRoutes } from "./routes/system";
import { errorPayload } from "./security";
import type { AppEnv } from "./types";

const app = new Hono<AppEnv>();

registerMiddleware(app);
registerSystemRoutes(app);
registerPluginRoutes(app);
registerContentRoutes(app);
registerParserRoutes(app);

app.notFound((c) =>
  errorPayload(c, 404, "NOT_FOUND", "Not Found", {
    apiVersion: API_VERSION,
    path: c.req.path,
  }),
);

app.onError((err, c) => {
  console.error("Unhandled worker error:", err);
  return errorPayload(c, 500, "INTERNAL_SERVER_ERROR", "Internal Server Error", {
    apiVersion: API_VERSION,
  });
});

export default app;
