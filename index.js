const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const itemsSchema = {
    name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const arr=[{name: "Welcome to our ToDo List"}, {name: "Press + to add more items"}, {name: "<-- Use check-box to mark an item as done!"}];

// Item.deleteMany({name: /o/}, function(){
//     console.log("deleted");
// });

app.get("/", function(req, res) {
    let date = Date.getDate();
    Item.find({}, function(err, foundItems){
        if(foundItems === 0){
            Item.insertMany(arr, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully added to DB!");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list", { listTitle: date, items: foundItems});
        }
    });
});

app.post("/", function(req, res) {
    let itemName = req.body.newItem;
    
    const item = new Item({
        name: itemName,
    })
    item.save();
    res.redirect("/");
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