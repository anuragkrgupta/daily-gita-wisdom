import serverModule from "../dist/server/server.js";
const server = serverModule.default ?? serverModule;
if (!server || typeof server.fetch !== "function") {
  console.error("Server fetch not available. Export keys:", Object.keys(serverModule));
  process.exit(1);
}
(async () => {
  const res = await server.fetch(new Request("https://example.com/"));
  const text = await res.text();
  const links = text.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/g) || [];
  console.log("status", res.status);
  console.log("stylesheet links:");
  for (const l of links) console.log("  ", l);
  console.log("\n--- head ---\n");
  const head = text.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (head) console.log(head[1]);
})();
