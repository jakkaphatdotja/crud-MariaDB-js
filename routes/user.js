const express = require("express");
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require("../database/db");
const saltRounds = 10;

router.get("/:id", async (req, res)=>{
    try {  
        const queryData = "SELECT * FROM user WHERE id=?";
        const record = await db.query(queryData, req.params.id);

        if (record.length === 0) {
            return res.status(200).json(`no record id: ${req.params.id}`);;
        }

        return res.status(200).json(record);
    } catch (err) {
        return res.status(400).send(err);
    }
});

router.get("/list/all", async (req, res)=>{
    try {  
        const queryData = "SELECT * FROM user";
        const record = await db.query(queryData);

        if (record.length === 0) {
            return res.status(200).json(`no data in record`);;
        }

        return res.status(200).json(record);
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.post("/signup", async (req, res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password.toString();
        const email = req.body.email;
        const phone = req.body.phone;

        // check if username or email already exists in the database
        const checkUserQuery = "SELECT * FROM user WHERE username = ? OR email = ? OR phone = ?";
        const existingUser = await db.query(checkUserQuery, [username, email, phone]);

        if (existingUser.length > 0) {
            return res.status(400).json({ error: "Username, email, or phone already exists." });
        }

        // password hashing
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const dataQuery = "INSERT INTO user (username, password, email, phone) VALUES (?,?,?,?)";
        const result = await db.query(dataQuery, [username, hashedPassword, email, phone]);
        
        const resultWithStrings = {
            ...result,
            insertId: result.insertId.toString(),  // assuming insertId is a BigInt
        };

        return res.status(200).json({ success: true, message: "Sign-up successful!" });
    } catch (err) {
        return res.status(400).send({ success: false, error: err.message });
    }
});

router.post("/signin", async (req, res)=>{
    try {
        const username = req.body.username;
        const password = req.body.password;
        
        const getUser = "SELECT * FROM user WHERE username = ?";
        const user = await db.query(getUser, [username]);
        
        if (user.length === 0) {
            return res.status(401).json({ error: "Invalid username or password." });
        }

        // compare hashed password
        const hashedPassword = user[0].password;
        const passwordMatch = await bcrypt.compare(password, hashedPassword);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid username or password." });
        }
        
        // successful sign-in
        return res.status(200).json({ message: "Sign-in successful!" });
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

module.exports = router;