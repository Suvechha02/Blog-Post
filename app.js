require("dotenv").config();

const express = require("express");
const expressLayout = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const mongoStore = require("connect-mongo");
const session = require("express-session");
const connectDB = require("./server/config/db");
const { isActiveRoute } = require("./server/helper/routeHelper");

const app = express();
const PORT = 5000 || process.env.PORT;

// connect to database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));

app.use(
  session({
    secret: "keyboard Bose",
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

app.use(express.static("public"));

// Template Engine
app.use(expressLayout);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.locals.isActiveRoute = isActiveRoute;

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`App is listening on port no ${PORT}`);
});
