import * as data from "../data/index.js";
// import * as helper from "../helpers.js";
import express from "express";

const router = express.Router();

// router.route("/").get(async (req, res) => {
//     try {
//         let increaseRes = await data.anxietyData.increaseAnxiety();
//         return res.json(increaseRes);
//     } catch (e) {
//         return res.status(500).json({ error: e });
//     }
// });

router.post("/", async (req, res) => {
    const { userName, day, time } = req.body;

    if (!userName || !day || !time) {
        return res.status(400).json({ error: "Missing or invalid data" });
    }

    try {
        const result = await data.anxietyData.updateAnxietyCount(
            userName,
            day,
            time
        );
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
