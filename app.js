require('dotenv').config()
const express = require("express");
const cors = require('cors')
var compression = require("compression");
const cookieParser = require("cookie-parser")
require("./services/dbConect")
const app = express()
app.use(express.json())
app.use(cookieParser())
const students = require("./models/student");
const router=require("./routes/userApi")
const validrouter=require("./routes/auth")


// var corsOption={
//         origin:"http://localhost:4200"
// }
app.use(compression());
// app.use(cors(corsOption))
// app.use(express.urlencoded({ extended: false }));
app.use(express.static('/meanstack'));

app.get("/api/signout", async (req, res) => {
        res.clearCookie("mainproject");
        res.json({
                name: false
        })
        
})
app.use("/api",router)
app.use("/api",validrouter)

app.get('*', function(req,res) {
console.log(__dirname+"kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
res.sendFile(path.join(__dirname+'/meanstack/index.html'));
});
app.listen(process.env.PORT||3000, () => {
        console.log("Server start at: " + "http://localhost:" + 3000 + "/")

})