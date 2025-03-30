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
    const { userName, hourKey, count } = req.body;

    if (!userName || !hourKey || typeof count !== "number") {
        return res.status(400).json({ error: "Missing or invalid data" });
    }

    try {
        const result = await data.anxietyData.updateAnxietyCount(
            userName,
            hourKey,
            count
        );
        res.json({
            message: "Anxiety updated",
            timestamp: new Date().toLocaleString(),
            totalCount: result.totalCount,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
