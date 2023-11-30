const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

//env
dotenv.config({ path: ".env"});
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//path routes
const userRouter = require("./routes/user");
const itemRouter = require("./routes/shoes");

//use routes
app.use("/api/user", userRouter);
app.use("/api/item", itemRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get("/", (req, res)=>{
    res.json("Welcome");
});