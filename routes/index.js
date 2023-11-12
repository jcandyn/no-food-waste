import foodRoutes from "./foodRoutes.js";
import recipeRoutes from "./recipeRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";

const constructorMethod = (app) => {
  app.use("/foodRoutes", foodRoutes);
  app.use("/analyticsRoutes", analyticsRoutes);
  app.use("/recipeRoutes", recipeRoutes);
  //   app.use("/users", userRoutes);
  //   app.get("/about", (req, res) => {
  //     res.sendFile(path.resolve("static/about.html"));
  //   });
  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

export default constructorMethod;
