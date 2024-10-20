const sessions = new Map();
//permanent session for development
const setDevSession = (devToken, devUserId) => {
  sessions.set(devToken, devUserId);
};

const getUserByUserName = (username, router) => {
  const users = router.db.get("users").value();
  return users.find((el) => el.username === username);
};

const getUsersProfile = (token, router) => {
  const authorizedUserId = sessions.get(token);
  if (!authorizedUserId) return;
  const users = router.db.get("users").value();
  const employees = router.db.get("employees").value();
  const auth_data = { ...users.find((u) => u.id === authorizedUserId) };
  delete auth_data.password;
  const employee_data = employees.find((e) => e.id === auth_data.employeeId);
  return { auth_data, employee_data };
};

const closeSession = (token) => {
  sessions.delete(token);
};

const openSession = (token, userId) => {
  sessions.set(token, userId);
  const sessionExpiryTime = 30 * 60 * 1000;
  setTimeout(() => closeSession(token), sessionExpiryTime);
};

const getAuthHeaderParts = (req) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return { type: null, token: null };
  const [type, token] = authHeader.split(" ");
  return { type, token };
};

const isAuthorized = (req) => {
  const { type, token } = getAuthHeaderParts(req);
  return type === "Bearer" && token && sessions.has(token);
};

export {
  setDevSession,
  getUsersProfile,
  getUserByUserName,
  closeSession,
  openSession,
  getAuthHeaderParts,
  isAuthorized,
};
