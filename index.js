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
const listsSchema = {
    name: String,
    items: [itemsSchema],
}

const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listsSchema);

const date = Date.getDate();
const defaultList=[{name: "Welcome to our ToDo List"}, {name: "Press + to add more items"}, {name: "<-- Use check-box to mark an item as done!"}];

// Item.deleteMany({name: /o/}, function(){
//     console.log("deleted");
// });

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
            res.render("list", { listTitle: date, items: foundItems});
        }
    });
});

app.post("/", function(req, res) {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    
    const item = new Item({
        name: itemName,
    })

    if(listName === date){
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

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checked;
    const listName = req.body.listName;
    if(listName === date){
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

app.get("/:customListName", function(req, res) {
    const customListName = req.params.customListName;
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

// app.post("/work", function(req, res) {
//     let item = req.body.newItem;
//     workItems.push(item);

//     res.redirect("/work");
// });

// app.get("/about", function(req,res){
//     res.render("about");
// });

app.listen(3000, function() {
    console.log("Server started on port 3000");
});