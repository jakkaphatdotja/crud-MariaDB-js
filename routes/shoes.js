const express = require("express");
const router = express.Router();
const db = require("../database/db");

router.get("/shoes", async (req, res)=>{
    try {  
        const shoes = await db.query("SELECT * FROM shoes");
        res.status(200).json(shoes);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

module.exports = router;