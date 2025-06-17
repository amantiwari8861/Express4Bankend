require("dotenv").config();

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const { body, validationResult } = require('express-validator');
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const server = express();
const { userRoutes } = require("./routes/user.route");
const { loggingMiddleware } = require("./middlewares/router/logging.middleware");
const { run } = require("./config/mongoose.config");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const HOST_NAME = process.env.HOST_NAME || "localhost";

server.use(helmet());

// CORS (Only allow trusted origins)
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
server.use(cors(corsOptions));

// Body parsers
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// XSS protection
// server.use(xss());

// Rate Limiting (e.g. 100 requests per 15 minutes)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});
server.use(limiter);

server.use(morgan("dev"))
server.use(loggingMiddleware);
server.use(express.static(path.join(__dirname, "public")))

server.set('views', './public')
server.set('view engine', 'pug')
server.use("/api/v1/user", userRoutes);
server.get("/", (req, res) => {
    // res.send("server is up and running!")
    // res.sendFile(express.static(path.join(__dirname,'public','index.html')));
    res.render('home', { title: 'Hey', message: 'Hello there!' })
});
// server.get("*", (req, res) => {
//     res.status(404).send("404 - Page Not Found!");
// });
require("./config/mongoose.config").connect();

server.listen(PORT, HOST_NAME, () => {
    console.log(`server is running on http://${HOST_NAME}:${PORT}`);
});


// npm install jsonwebtoken
