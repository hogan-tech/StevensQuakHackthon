//You will code the route in this file
//Lecture Code Refernece -> https://github.com/stevens-cs546-cs554/CS-546/tree/master/lecture_05/routes

//You can import your getBooks() function in the /data/data.js file that you used for lab 3 to return the list of books.  You can also import your getBookById(id) function and call it in the :/id route.

import * as data from "../data/index.js";
// import * as helper from "../helpers.js";
import express from "express";

const router = express.Router();

router.route("/").get(async (req, res) => {
    try {
        let increaseRes = await data.anxietyData.increaseAnxiety();
        return res.json(increaseRes);
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

router.route("/").post(async (req, res) => {
    try {
        let newUser = await data.anxietyData.addAnxiety("wesley");
        return res.json({ count: newUser });
    } catch (e) {
        return res.status(500).json({ error: e });
    }
});

// Implement GET Request Method and send a JSON response  See lecture code!

export default router;
