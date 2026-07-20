import serverEntry from "../dist/server/server.js";

const server = serverEntry.default ?? serverEntry;

function buildHeaders(nodeHeaders) {
  const headers = new Headers();
  for (const [key, value] of Object.entries(nodeHeaders || {})) {
    if (!value) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item) headers.append(key, item);
      }
    } else {
      headers.set(key, value);
    }
  }
  return headers;
}

export default async function handler(req, res) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `${protocol}://${host}`);

  const request = new Request(url.toString(), {
    method: req.method,
    headers: buildHeaders(req.headers),
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req,
  });

  const response = await server.fetch(request, {}, {});

  res.statusCode = response.status;
  response.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  if (response.body) {
    const arrayBuffer = await response.arrayBuffer();
    res.end(Buffer.from(arrayBuffer));
  } else {
    res.end();
  }
}
