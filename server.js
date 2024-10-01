import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";
import {
  setDevSession,
  getUserByUserName,
  getUsersProfile,
  closeSession,
  openSession,
  getAuthHeaderParts,
  isAuthorized,
} from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, "public"),
});

//permanent session for dev (temp function)
const DEV_TOKEN = "2078289c-73e5-4137-8ceb-96445633512c";
const DEV_USER_ID = "57381626a500d7df59cc2f5c21323c3a";
setDevSession(DEV_TOKEN, DEV_USER_ID);

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

server.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const user = getUserByUserName(username.trim(), router);
  if (!user || user.password !== password) {
    return res.status(404).send("Invalid username or password");
  }
  const token = randomUUID();
  openSession(token, user.id);

  res.status(200).json({
    accesToken: token,
  });
});

server.use((req, res, next) => {
  if (isAuthorized(req)) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
});

server.get("/auth/profile", (req, res) => {
  const { token } = getAuthHeaderParts(req);
  const profile = getUsersProfile(token, router);
  if (profile) {
    return res.status(200).json(profile);
  }
});

server.post("/auth/logout", (req, res) => {
  const { token } = getAuthHeaderParts(req);
  if (token === DEV_TOKEN) {
    return res.status(200).json({ message: "Dev logged out" });
  }
  closeSession(token);
  res.status(200).json({ message: "Logged out successfully" });
});

server.use(router);
server.listen(4000, () => {
  console.log("JSON Server is running on http://localhost:4000");
});
