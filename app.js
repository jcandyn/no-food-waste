import express from "express";
import configRoutes from "./routes/index.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import exphbs from "express-handlebars";
import session from "express-session";
import path from "path";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const socketIO = new Server(server);

// Use the 'cors' middleware before routes
app.use(cors());

// New imports
const staticDir = express.static(path.join(__dirname, "/public"));
const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new exphbs.SafeString(JSON.stringify(obj, null, spacing));

      return new exphbs.SafeString(JSON.stringify(obj));
    },
  },
  partialsDir: [path.join(__dirname, "views")],
});

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  next();
};

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use(
  session({
    name: "AwesomeWebApp",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
  })
);

app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views"),
  })
);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

configRoutes(app, socketIO);

server.listen(3000, () => {
  console.log("App listening at http://localhost:3000");
});

export { app, server, socketIO };
