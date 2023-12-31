import recipeRoutes from "./recipeRoutes.js";
import foodRoutes from "./foodRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import homeRoute from "./homeRoute.js";
import authenticationRoutes from "./authenticationRoutes.js";
import shoppingRoutes from "./shoppingRoutes.js";
import shareRoutes from "./shareRoutes.js";

const constructorMethod = (app) => {
  app.use("/authenticate", authenticationRoutes);
  app.use("/recipes", recipeRoutes);
  app.use("/analytics", analyticsRoutes);
  app.use("/food", foodRoutes);
  app.use("/food/view", foodRoutes);
  app.use("/analyticsRoutes", analyticsRoutes);
  app.use("/shopping", shoppingRoutes);
  app.use("/sharing", shareRoutes);
  app.use("/", homeRoute);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
