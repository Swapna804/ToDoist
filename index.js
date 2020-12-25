const express = require("express");
const bodyParser = require("body-parser");
const Date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
const items = [];
const workItems = [];

app.get("/", function(req, res) {
    let date = Date.getDate();
    res.render("list", { listTitle: date, items: items });
});

app.post("/", function(req, res) {
    let item = req.body.newItem;
    console.log(item);
    if(req.body.list === 'Work'){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
});

app.get("/work", function(req, res) {
    res.render("list", { listTitle: "Work List", items: workItems });
});

app.post("/work", function(req, res) {
    let item = req.body.newItem;
    workItems.push(item);

    res.redirect("/work");
});

app.get("/about", function(req,res){
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});