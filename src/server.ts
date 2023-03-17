import Vision from "@hapi/vision";
import Hapi from "@hapi/hapi";
import Cookie from "@hapi/cookie";
import dotenv from "dotenv";
import path from "path";
import HapiSwagger from "hapi-swagger";
import Inert from "@hapi/inert";
import Joi from "joi";
import jwt from "hapi-auth-jwt2";
import { validate } from "./api/jwt-utils.js";
import { fileURLToPath } from "url";
import Handlebars from "handlebars";
import { apiRoutes } from "./api-routes.js";
import { webRoutes } from "./web-routes.js";
import { db } from "./models/db.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { isDbType } from "./utils/type-gaurds.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const result = dotenv.config();
if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

const swaggerOptions = {
  info: {
    title: "ShutterSpotter API",
    version: "0.2",
  },
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    }
  },
  security: [{ jwt: [] }],
};

async function init() {
  const server = Hapi.server({
    port: 3000,
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    host: process.env.HOST || "localhost",
  });

  await server.register(Vision);
  await server.register(Cookie);
  await server.register(Inert);
  await server.register(jwt);
  // @ts-ignore
  await server.register([Inert, Vision, { plugin: HapiSwagger, options: swaggerOptions }]);


  server.validator(Joi);

  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });

  server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.COOKIE_NAME,
      password: process.env.COOKIE_PASSWORD,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });
  server.auth.strategy("jwt", "jwt", {
    key: process.env.COOKIE_PASSWORD,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] }
  });
  server.auth.default("session");

  if (isDbType(process.env.DB_TYPE)) {
    db.init(process.env.DB_TYPE)
  } else {
    throw new Error("'DB_TYPE' env variable has not been set or is not valid.");
  }
  db.seed();
  server.route(apiRoutes);
  server.route(webRoutes);
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
