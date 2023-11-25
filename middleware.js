const printMiddleware = (req, res, next) => {
  let timestamp = new Date();
  let authentication = req.session.user
    ? "Authenticated User"
    : "Non-Authenticated User";
  console.log(
    `[${timestamp}]: ${req.method} ${req.originalUrl} (${authentication})`
  );

  if (
    req.originalUrl === "/login" ||
    req.originalUrl === "/protected" ||
    req.originalUrl === "/register" ||
    req.originalUrl === "/admin" ||
    req.originalUrl === "/logout"
  ) {
    return next();
  }

  if (req.session.user) {
    if (req.session.user.role === "admin") {
      return res.redirect("/protected");
    } else if (req.session.user.role === "user") {
      return res.redirect("/protected");
    }
  }

  return res.redirect("/login");
};

const loginMiddleware = (req, res, next) => {
  if (req.session.user) {
    if (req.session.user.role === "admin") {
      return res.redirect("/admin");
    } else if (req.session.user.role === "user") {
      return res.redirect("/protected");
    }
  } else {
    return next();
  }
};

const registrationMiddleware = (req, res, next) => {
  if (req.path === "/register" && req.method === "GET") {
    if (req.session.user) {
      if (req.user.role === "admin") {
        return res.redirect("/admin");
      } else if (req.user.role === "user") {
        return res.redirect("/protected");
      }
    }
    return next();
  }

  next();
};

const protectedMiddleware = (req, res, next) => {
  if (req.path === "/protected" && req.method === "GET") {
    if (req.session.user) {
      return next();
    } else {
      return res.redirect("/login");
    }
  }

  next();
};

const adminMiddleware = (req, res, next) => {
  if (req.path === "/admin" && req.method === "GET") {
    if (req.session.user && req.session.user.role === "admin") {
      return next();
    } else {
      res.status(403).render("error", {
        error: "You don't have access.",
      });
    }
  } else {
    return res.redirect("/login");
  }
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
  protectedMiddleware,
  adminMiddleware,
  logoutMiddleware,
};
