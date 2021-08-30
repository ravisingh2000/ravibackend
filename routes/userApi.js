const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const students = require("../models/student");
const templats=require("..//models/template")
router.get("/getdata", async (req, res) => {
        try {
                const token = req.cookies.mainproject;
                const verify = await jwt.verify(token, "ravisingh");
                const data = await students.findOne({ email: verify.email });
                res.json({
                        name: true,
                        data: data
                })
        }
        catch (e) {
                res.json({
                        name: false
                })
        }
})
router.get("/gettemplatedata", async (req, res) => {
        try {
                const token = req.cookies.mainproject1;
                console.log(token)
                console.log("hhhhhhhhhhhhhhhhhhhhhhhh")
                if(token!=undefined){
                //  const verify = await jwt.verify(token, "ravisingh");
                const data = await templats.findOne({ Email: token });
               console.log("duduudududu")
               console.log(data)
                res.json({
                        name: true,
                        data: data
                })
        }
                else{
                        res.json({
                                name: false
                        })
                }
        }
        catch (e) {
                res.json({
                        name: false
                })
        }
})
router.post("/register", async (req, res, next) => {
        console.log(req.body) 
        if (req.body.data.password == req.body.data.cnpassword) {
                try {
                        const submit = new students({
                                "FirstName": req.body.data.firstname,
                                "LastName": req.body.data.lastname,
                                "email": req.body.data.email,
                                "Password": req.body.data.password
                        })
                        submit.save();
                        res.json({
                                nmae: true
                        })
                }
                catch (e) {
                        res.status(404).send("IncorectPassword!")

                }
        }
        else {

                res.json({
                        nmae: false
                })

        }
})
router.post("/template", async (req, res, next) => {
        console.log(req.body) 
        console.log("hhhhhhhh")
        res.cookie("mainproject1", req.body.data.Email,
        { maxAge: 31536000000 }
);
        console.log(req.body.data.Education[0].Educationname)
        console.log("hhhhhhhhh")
        // if (req.body.data.password == req.body.data.cnpassword) {
                try { console.log(req.body.data.Name)
                        const submit = new templats({
                                "Name": req.body.data.Name,
                                "Email": req.body.data.Email,
                                "Phone":req.body.data.Phone,
                                "Position":req.body.data.Position,
                                "Address":req.body.data.Address,
                                "Objective":req.body.data.Objective,
                                "skills":req.body.data.skills,
                                "Education":req.body.data.Education,
                                "Experience":req.body.data.Experience,
                                "Project":req.body.data.Project,
                                "Certificate":req.body.data.Certificate,
                                "Social":req.body.data.Social
                        })
                        const data =await submit.save();
                        console.log(data)
                        
                        res.json({
                               data:data 
                        })
                }
                catch (e) {
                        res.status(404).send("IncorectPassword!")

                }
        }
)
// router.get("/template", async (req, res, next) => {
        
// })
router.post("/home", async (req, res) => {
        try {
                console.log("gggggggggggg")  
                
                const data = await students.findOne({ email: req.body.data.email });
                const bcryptpassword = await bcrypt.compare(req.body.data.password, data.Password);
                if (bcryptpassword == true) {
                        const token = jwt.sign({ email: req.body.data.email }, "ravisingh")
                        res.cookie("mainproject", token,
                                { maxAge: 31536000000 }
                        );
                        res.json({
                                bcrypt: true,
                                data: data
                        })
                }
                else {
                        res.json(
                                {
                                        bcrypt: false
                                })
                }
        }
        catch (error) {
                res.json(
                        {
                                bcrypt: false
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
                                res.json({
                                        bcrypt: true,
                                        data: data
                                })
                        }
                        else if (bcryptpassword == false) {
                                res.json({
                                        bcrypt: false
                                })
                        }

                }

                catch (error) {
                        res.json({
                                bcrypt: false
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
                res.json({
                        bcrypt:true,
                        data: data
                })
        }
        else {
                res.json({
                        bcrypt: false
                })
        }

})
module.exports = router;