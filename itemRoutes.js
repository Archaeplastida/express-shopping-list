const express = require("express"), router = new express.Router(), shoppingList = require("./fakeDb");

const checkExistence = (objList, name) => {
    let idx = 0;
    for (let item of objList){
        if(item["name"] === name) return [item, idx];
        idx++;
    }
    return false;
}

router.get("/", (req, res, next) => {
    return res.json(shoppingList);
})

router.get("/:name", (req, res, next) => {
    const theItem = checkExistence(shoppingList, req.params.name)[0];
    if (theItem) return res.json(theItem);
    return res.send("Literally nothing in here.");
})

router.post("/", (req, res, next) => {
    console.log(req.body)
    const newItem = {name: req.body.name, price: req.body.price};
    shoppingList.push(newItem);
    res.status(201).json({added:newItem});
})

router.patch("/:name", (req, res, next) => {
    const edittingItem = checkExistence(shoppingList, req.params.name)[1];
    shoppingList[edittingItem] = {name: req.body.name, price: req.body.price};
    res.status(201).json({updated:shoppingList[edittingItem]});
})

router.delete("/:name", (req, res, next) => {
    const itemToDelete = checkExistence(shoppingList, req.params.name)[1];
    shoppingList.splice(itemToDelete, 1);
    res.status(201).json({message:"Deleted"});
})

module.exports = router;