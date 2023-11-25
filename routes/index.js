import foodRoutes from "./foodRoutes.js";
import recipeRoutes from "./recipeRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import homeRoute from "./homeRoute.js";
import authenticationRoutes from "./authenticationRoutes.js";

const constructorMethod = (app) => {
  app.use("/food", foodRoutes);
  app.use("/analyticsRoutes", analyticsRoutes);
  app.use("/recipeRoutes", recipeRoutes);
  app.use("/signup", authenticationRoutes);
  app.use("/login", authenticationRoutes);
  app.use("/logout", authenticationRoutes);
  app.use("/", homeRoute);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
