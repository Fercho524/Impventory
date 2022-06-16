const express = require('express');

const momment = require("momment");

const router = express.Router();

const pool = require('../database');

router.get("/", async (req, res) => {
    const prices = await pool.query('SELECT * FROM Historial');
    res.render("prices/history", { prices });
})

module.exports = router;