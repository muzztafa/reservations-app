const express = require("express");
// const jwt = require("express-jwt");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');

const cors = require("cors");
// const mongoose = require("./mongoose");


// Import ENV Vars
// require("dotenv").config({
//   allowEmptyValues: true,
//   path: path.resolve(__dirname, "../.env"),
// });

// Set up Global configuration access
dotenv.config();
console.log(process.env.JWT_SECRET)

const reservationsRoutes = require("./server/api/routes/reservations.route");
const userRoutes = require("./server/api/routes/user.route");
// const activateRoutes = require("./api/routes/activate.route");
// const taskRoutes = require("./api/routes/task.route");
// const photoRoutes = require("./api/routes/photo.route");

const app = express();

//open firebase connection
// const db = firebase.connect();

// const snapshot = db.collection('reservations').get();
// snapshot.forEach((doc) => {
//     console.log(doc.id, '=>', doc.data());
// });



app.use(cors());

app.set("view engine", "html");


// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/reservations", reservationsRoutes);
app.use("/users", userRoutes);

// listen to requests
app.listen(5000, () =>
    console.log(`server started on port 5000`)
);

/**
 * Exports express
 * @public
 */

module.exports = app;
