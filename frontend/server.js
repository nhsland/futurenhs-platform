const express = require("express");
const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");
const passport = require("passport");
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;
const next = require("next");
const dotenv = require("dotenv");

const devProxy = {
  "/hello": {
    target: "http://hello-world.hello-world/",
    changeOrigin: true,
  },
};

const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }

  return value;
};

dotenv.config({ path: ".env.development" });
dotenv.config({ path: ".env.development.local" });

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const sessionStore = dev
  ? undefined
  : new (connectPgSimple(session))({
      conString: requireEnv("DATABASE_URL"),
    });
const sessionCookieSecret = requireEnv("COOKIE_SECRET");
const app = next({
  dir: ".", // base directory where everything is, could move to src later
  dev,
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    // Dev proxy
    if (dev) {
      const { createProxyMiddleware } = require("http-proxy-middleware");
      Object.keys(devProxy).forEach(function (context) {
        server.use(context, createProxyMiddleware(devProxy[context]));
      });
    }

    // Login session
    passport.serializeUser((user, done) => {
      done(null, JSON.stringify(user));
    });
    passport.deserializeUser((user, done) => {
      done(null, JSON.parse(user));
    });
    passport.use(
      "aadb2c",
      new OIDCStrategy(
        {
          identityMetadata:
            "https://futurenhsplatform.b2clogin.com/futurenhsplatform.onmicrosoft.com/v2.0/.well-known/openid-configuration",
          clientID: requireEnv("AAD_B2C_CLIENT_ID"),
          clientSecret: requireEnv("AAD_B2C_CLIENT_SECRET"),
          responseType: "code",
          responseMode: "query",
          redirectUrl: `${requireEnv("ORIGIN")}/auth/login/callback`,
          passReqToCallback: false,
          allowHttpForRedirectUrl: dev,
          isB2C: true,
        },
        (profile, done) => {
          done(null, {
            id: profile.sub,
            name: profile.displayName,
            emails: profile.emails,
          });
        }
      )
    );
    server.use(
      session({
        store: sessionStore,
        secret: sessionCookieSecret,
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
          sameSite: "lax",
          secure: !dev,
        },
      })
    );
    server.use(passport.initialize());
    server.use(passport.session());
    server.get(
      "/auth/login",
      (req, _res, next) => {
        req.session["login.next"] = req.query.next;
        req.query.p = "b2c_1_signin";
        next();
      },
      passport.authenticate("aadb2c", {
        prompt: "login",
        failureRedirect: "/auth/login/failed",
      })
    );
    server.get(
      "/auth/login/callback",
      passport.authenticate("aadb2c", {
        failureRedirect: "/auth/login/failed",
      }),
      (req, res) => {
        const next = req.session["login.next"] || "/";
        delete req.session["login.next"];
        res.redirect(next);
      }
    );
    server.get("/auth/logout", (req, res) => {
      req.logout();
      res.redirect("/");
    });

    // Default catch-all handler to allow Next.js to handle all other routes
    server.all("*", (req, res) => handle(req, res));

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("An error occurred, unable to start the server");
    console.error(err);
    process.exit(1);
  });
