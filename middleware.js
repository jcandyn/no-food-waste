const printMiddleware = (req, res, next) => {
  let timestamp = new Date();
  let authentication = req.session.user
    ? "Authenticated User"
    : "Non-Authenticated User";
  console.log(
    `[${timestamp}]: ${req.method} ${req.originalUrl} (${authentication})`
  );

  if (
    req.originalUrl === "/authenticate/signup" ||
    req.originalUrl === "/authenticate/login" ||
    req.originalUrl === "/authenticate" ||
    req.originalUrl === "/food" ||
    req.originalUrl === "/shopping" ||
    req.originalUrl === "/shopping/delete" ||
    req.originalUrl === "/authenticate/logout"
  ) {
    return next();
  }

  return res.redirect("/");
};

const loginMiddleware = (req, res, next) => {
  if (req.session.user && req.method === "POST") {
    return res.redirect("/food");
  } else {
    return next();
  }
};

const registrationMiddleware = (req, res, next) => {
  if (req.path === "/signup" && req.method === "POST") {
    if (req.session.user) {
      return res.redirect("/food");
    }
    return next();
  }

  next();
};

const logoutMiddleware = (req, res, next) => {
  if (req.path === "/logout" && req.method === "GET") {
    if (req.session.user) {
      return next();
    } else {
      return res.redirect("/login");
    }
  }

  next();
};

export {
  printMiddleware,
  loginMiddleware,
  registrationMiddleware,
  logoutMiddleware,
};
