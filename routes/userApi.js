const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const students = require("../models/student");


router.get("/getdata", async (req, res) => {
        try {
                const token = req.cookies.mainproject;
                const verify = await jwt.verify(token,process.env.SECRET_KEY );
                const data = await students.findOne({ email: verify.email });
                res.status(200).json({
                        valid: true,
                        data: data
                })
        }
        catch (e) {
                res.status(200).json({
                        valid: false
                })
        }
})

router.post("/register", async (req, res, next) => {
        // console.log(req.body) 
        if (req.body.data.password == req.body.data.cnpassword) {
                try {
                        const submit = new students({
                                "FirstName": req.body.data.firstname,
                                "LastName": req.body.data.lastname,
                                "email": req.body.data.email,
                                "Password": req.body.data.password
                        })
                        submit.save();
                        res.status(200).json({
                                valid: true
                        })
                }
                catch (e) {
                        res.status(401).send("IncorectPassword!")

                }
        }
        else {

                res.status(401).json({
                        valid: false
                })

        }
})

router.post("/profile", async (req, res) => {
        try {
                console.log("gggggggggggg")  
                
                const data = await students.findOne({ email: req.body.data.email });
                const bcryptpassword = await bcrypt.compare(req.body.data.password, data.Password);
                if (bcryptpassword == true) {
                        const token = jwt.sign({ email: req.body.data.email }, "ravisingh")
                        res.cookie("mainproject", token,
                                { maxAge: 31536000000 }
                        );
                        res.status(200).json({
                                bcryptValid: true,
                                data: data
                        })
                }
                else {
                        res.status(401).json(
                                {
                                        bcryptValid: false
                                })
                }
        }
        catch (error) {
                res.json(
                        {
                                bcryptValid: false
                        })

        }
})
router.post("/update", async (req, res, next) => {

        if (req.body.data.password != "") {
                try {
                        let data = await students.findOne({ email: req.body.data.email });
                        const bcryptpassword = await bcrypt.compare(req.body.data.password, data.Password);
                        if (bcryptpassword == true) {
                                data = await students.findOneAndUpdate({ email: req.body.data.email }, {
                                        $set: {
                                                "FirstName": req.body.data.firstname,
                                                "LastName": req.body.data.lastname,
                                                "email": req.body.data.email,
                                                "Password": req.body.data.password_confirmation,
                                                "College": req.body.data.college
                                        }
                                })
                                res.status(200).json({
                                        bcryptValid: true,
                                        data: data
                                })
                        }
                        else if (bcryptpassword == false) {
                                res.status(401).json({
                                        bcryptValid: false
                                })
                        }

                }

                catch (error) {
                        res.json({
                                bcryptValid: false
                        })

                }
        }
        else if (req.body.data.password == "") {
                data = await students.findOneAndUpdate({ email: req.body.data.email }, {
                        $set: {
                                "FirstName": req.body.data.firstname,
                                "LastName": req.body.data.lastname,
                                "email": req.body.data.email,
                                "College": req.body.data.college,

                        }
                }, {
                        new: true,
                        useFindAndModify: false
                })
                res.status(200).json({
                        bcryptValid:true,
                        data: data
                })
        }
        else {
                res.json({
                        bcryptValid: false
                })
        }

})
module.exports = router;