const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");

app.get("/", function(req, res){
    var today= new Date();
    var options={
        day: "numeric",
        weekday: "long",
        month: "long",
    }
    var date= today.toLocaleDateString("en-US",options);
    res.render("list",{date:date});
});

app.post("/", function(req, res){
    console.log(req.body.newItem);
});

app.listen(3000, function(){
    console.log("Server started on port 3000");
});