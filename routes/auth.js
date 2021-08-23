const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")

router.get("/valid", async (req, res) => {
        try {
                const token = req.cookies.mainproject;
                await jwt.verify(token, "ravisingh");
                res.json({
                        value: true
                })
        }
        catch (e) {

                res.json({
                        value: false
                })
        }
})

module.exports = router;