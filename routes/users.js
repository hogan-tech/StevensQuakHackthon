import * as data from "../data/index.js";
// import * as helper from "../helpers.js";
import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) {
        return res
            .status(400)
            .json({ error: "Username and password required" });
    }

    try {
        const user = await data.usersData.addUser(userName, password);
        res.status(201).json({ message: "User registered", user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.post("/login", async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res
            .status(400)
            .json({ error: "Username and password required" });
    }

    try {
        const user = await data.usersData.loginUser(userName, password);
        res.status(200).json(user);
    } catch (e) {
        res.status(401).json({ error: e.message });
    }
});

export default router;
