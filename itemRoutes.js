const express = require("express"), router = new express.Router(), shoppingList = require("./fakeDb"), ExpressError = require("./expressError");

const checkExistence = (objList = Array, name = String) => {
    let idx = 0;
    for (let item of objList) {
        if (item["name"] === name) return [item, idx];
        idx++;
    }
    return false;
}

router.get("/", (req, res, next) => {
    return res.json(shoppingList);
})

router.get("/:name", (req, res, next) => {
    try {
        const theItem = checkExistence(shoppingList, req.params.name)[0];
        if (theItem) return res.json(theItem);
        throw new ExpressError(`"${req.params.name}" does not exist.`, 404);
    }
    catch (err) {
        return next(err);
    }
})

router.post("/", (req, res, next) => {
    try {
        const newItem = { name: req.body.name, price: req.body.price };
        if (newItem.name && newItem.price) {
            shoppingList.push(newItem);
            return res.status(201).json({ added: newItem });
        }
        throw new ExpressError("Missing or incorrect parameter(s)!", 406);
    }
    catch (err) {
        return next(err);
    }
})

router.patch("/:name", (req, res, next) => {
    try {
        const edittingItem = checkExistence(shoppingList, req.params.name)[1];
        console.log(edittingItem);
        if (typeof edittingItem === "number") {
            if (req.body.name && req.body.price) {
                shoppingList[edittingItem] = { name: req.body.name, price: req.body.price };
                return res.status(201).json({ updated: shoppingList[edittingItem] });
            }
            throw new ExpressError("Missing or incorrect parameter(s)!", 406);
        }
        throw new ExpressError(`"${req.params.name}" does not exist, or you may have not put a 'name' parameter!`, 404);
    }
    catch (err) {
        return next(err);
    }
})

router.delete("/:name", (req, res, next) => {
    try {
        const itemToDelete = checkExistence(shoppingList, req.params.name)[1];
        if (typeof itemToDelete === "number") {
            shoppingList.splice(itemToDelete, 1);
            res.status(201).json({ message: "Deleted" });
        }
        throw new ExpressError(`"${req.params.name}" does not exist.`, 404);

    }
    catch (err) {
        return next(err);
    }

})

module.exports = router;