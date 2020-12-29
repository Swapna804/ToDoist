//Dependencies and packages-
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");

//Setting up my app and ejs view engine-
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

//Connecting to the Mongo database using ODM Mongoose-
mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

// Setting up schemas for the collections-
const itemsSchema = {
    name: String,
};
const listsSchema = {
    name: String,
    items: [itemsSchema],
}

//Making models for those schemas-
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listsSchema);

//Default list items-
const defaultList=[{name: "Welcome to our ToDo List"}, {name: "Press + to add more items"}, {name: "<-- Use check-box to mark an item as done!"}];

//Get and Post request for the home route-
app.get("/", function(req, res) {
    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0){
            Item.insertMany(defaultList, function(err){
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
            res.render("list", { listTitle: "Today", items: foundItems});
        }
    });
});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = _.capitalize(req.body.list);
    
    const item = new Item({
        name: itemName,
    })

    if(listName === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName}, function(err, foundList){
            if(!err){
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            }
        });
    }
});

//Post request to delete list item from home route or custom list
app.post("/delete", function(req, res){
    const checkedItemId = req.body.checked;
    const listName = _.capitalize(req.body.listName);
    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId, function(err){
            if(!err){
                console.log("Successfully deleted checked item");
                res.redirect("/");
            }
        });
    }
    else{
        List.findOneAndUpdate({name: listName}, { $pull: {items: {_id: checkedItemId}}}, function(err, foundList){
            if(!err){
                res.redirect("/" + listName);
            };
        });
    }
});

//Get request for custom list
app.get("/:customListName", function(req, res) {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}, function(err, foundList){
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultList,
                });
                list.save();
            }
            else{
                res.render("list", {listTitle: customListName, items: foundList.items});
            }
        }
    });
});

//Launching server on port 3000-
app.listen(3000, function() {
    console.log("Server started on port 3000");
});