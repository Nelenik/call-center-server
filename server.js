import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import { readFileSync } from "fs";

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

const sessions = new Map();

const getDbScript = (property) => {
  const db = JSON.parse(readFileSync("./db.json", "utf-8"));
  return db[property];
};

const getUserByUserName = (username) => {
  const users = getDbScript("users");
  return users.find((el) => el.username === username);
};
const closeSession = (token) => {
  sessions.delete(token);
};

const openSession = (token, userId) => {
  sessions.set(token, userId);
  const sessionExpiryTime = 30 * 60 * 1000;
  setTimeout(() => closeSession(token), sessionExpiryTime);
};

const isAuthorized = (req) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  return token && sessions.has(token);
};

server.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = getUserByUserName(username.trim());
  if (!user || user.password !== password) {
    return res.status(404).send("Invalid username or password");
  }
  const token = randomUUID();
  openSession(token, user.id);

  res.status(200).json({
    accesToken: token,
    userId: user.id,
    employeeId: user.employeeId,
    role: user.role,
  });
});

server.post("/auth/logout", (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (token && sessions.has(token)) {
    closeSession(token);
    return res.status(200).json({ message: "Logged out successfully" });
  }
  return res.status(404).send("Session not found");
});

server.use((req, res, next) => {
  if (isAuthorized(req)) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});

server.use(router);
server.listen(4000, () => {
  console.log("JSON Server is running on http://localhost:4000");
});
