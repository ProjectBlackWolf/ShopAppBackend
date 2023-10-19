const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("./validInfo").default;
const jwtGenerator = require("./jwtGenerator");
const authorize = require("./authorize");

//authorizeentication

router.post("/register", validInfo, async (req, res) => {
  const { name, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE us = $1", [
      us
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    let newUser = await pool.query(
      "INSERT INTO users (us, ps) VALUES ($1, $2) RETURNING *",
      [name, bcryptPassword]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validInfo, async (req, res) => {
  const { us, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE us = $1", [
      us
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].ps
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = jwtGenerator(user.rows[0].id);
    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;