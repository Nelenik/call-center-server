import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, "public"),
});
server.use(middlewares);

server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  const newDate = new Date().toISOString();
  if (req.method === "POST" || req.method === "PUT") {
    req.body.createdAt = newDate;
    req.body.updatedAt = newDate;
  } else if (req.method === "PATCH") {
    req.body.updatedAt = newDate;
  }
  next();
});
server.use(
  jsonServer.rewriter({
    "/calls/:employeeId": "/calls?employeeId=:employeeId",
  })
);
server.use(router);
server.listen(4000, () => {
  console.log("JSON Server is running on http://localhost:4000");
});
