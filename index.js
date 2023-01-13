require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const formidable = require("express-formidable");
const userRoutes = require("./server/routes/userRoutes");
const PORT = process.env.PORT || 5010;

const app = express();

app.use(morgan("dev"));
app.use(cors());

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

////////////////////////////////////////
// Enable form data parsing
// app.use(formidable());
// app.post("/form", (req, res) => {
//   console.log(req.fields);
//   res.status(200).json( req.fields );
// });
////////////////////////////////////////

// Connect to database
mongoose
  .connect(process.env.DATABASE_URL, {
    dbName: "E-learning",
    useNewUrlParser: true,
    useUnifiedTopology: true,

  })
  .then((result) => {
    console.log(`Connected to Database`);
    console.log(`Listening on port ${PORT}`);
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/user", userRoutes);
app.get("/", (req, res) => {
  res.status(200).json({ done: "Hello" });
});

// app.listen(PORT, (req, res) => {
//   console.log(`SERVER WORK IN PORT ${PORT}`);
// });
