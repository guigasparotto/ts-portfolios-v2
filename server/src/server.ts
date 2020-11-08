import express from "express";
import config from "./config";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/users";
import connectDB from "./config/db";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import { AppRouter } from "./AppRouter";
import "./controllers/RootController";
import "./controllers/LoginController";
import "./controllers/UsersController";

// Create express app
const app = express();

// Connection to database
connectDB();

// Required to parse json request body - defines req.body property
// Configuration must be placed before routes configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cookie session stores information about user session in a cookie
app.use(cookieSession({ keys: ["testString"] }));

// Define the routes
// app.use("/api/users", userRouter);
// app.use("/api/auth", authRouter);
app.use(AppRouter.getInstance());

app.listen(config.PORT, () => console.log(`Server started on port ${config.PORT}`));
