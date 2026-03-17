const http = require("http");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/api") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const time = new Date().toISOString();
      const length = body.length;
      console.log(`received a message at ${time} with length ${length} bytes`);
      setTimeout(() => {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true }));
      }, 500);
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
