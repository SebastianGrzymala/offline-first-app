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
      setTimeout(
        () => {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        },
        200 + Math.random() * 500, // The timeout is now randomly between 200ms and 700ms.
      );
    });
  } else if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Server is running and ready to accept requests");
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
