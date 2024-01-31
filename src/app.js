import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import { __dirname } from "./utils.js";
import path from "path";
import loginRoute from "./routes/login.route.js";
import signupRouter from "./routes/signup.route.js";
import sessionRouter from "./routes/session.route.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const cookieSecret = process.env.SECRET;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(cookieSecret));

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: DB_URL,
      ttl: 60,
      mongoOptions: {
        useNewUrlParser: true,
      },
    }),
    secret: cookieSecret,
    resave: false,
    saveUninitialized: true,
  })
);

// rutas
app.use("/signup", signupRouter);
app.use("/login", loginRoute);
app.use("/logout", loginRoute);
app.use("/", sessionRouter);


// coneccion db
const environment = async () => {
  try {
    await mongoose.connect(DB_URL);
  } catch (error) {
    console.log(error);
  }
};

// iniciando db
environment();

// iniciando server

const server = app.listen(PORT, () => console.log("server conectado"));

server.on("error", (error) => console.log(error));
