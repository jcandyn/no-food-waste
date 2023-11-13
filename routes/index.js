import foodRoutes from "./foodRoutes.js";
import recipeRoutes from "./recipeRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";
import homeRoute from "./homeRoute.js";

const constructorMethod = (app) => {
  app.use("/foodRoutes", foodRoutes);
  app.use("/analyticsRoutes", analyticsRoutes);
  app.use("/recipeRoutes", recipeRoutes);
  app.use("/", homeRoute);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
