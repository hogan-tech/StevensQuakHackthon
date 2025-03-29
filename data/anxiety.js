import { anxiety } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const addAnxiety = async (userName) => {
    const anxietyCollection = await anxiety();
    let newUser = {
        name: userName,
        count: 0,
    };
    const insertRes = await anxietyCollection.insertOne(newUser);
    if (!insertRes) {
        console.log(insertRes);
    }
    return insertRes.insertedId;
};

export const increaseAnxiety = async (userName) => {
    const anxietyCollection = await anxiety();
    const updateResult = await anxietyCollection.findOneAndUpdate(
        { name: userName }, // 查詢條件
        { $inc: { count: 1 } }, // 將 count 欄位 +1
        { returnDocument: "after" } // 更新後回傳的 document
    );

    if (!updateResult) {
        throw `User not found`;
    }

    return updateResult;
};

export const updateAnxietyCount = async (userName, hourKey, count) => {
    const anxietyCollection = await anxiety();

    // 更新某使用者在某小時的 count
    await anxietyCollection.updateOne(
        { userName, hourKey },
        { $inc: { count: count } },
        { upsert: true }
    );

    // 計算今天該使用者的總數
    const todayStr = new Date().toISOString().slice(0, 10); // "2025-03-29"
    const totalToday = await anxietyCollection
        .aggregate([
            {
                $match: {
                    userName,
                    hourKey: { $regex: `^${todayStr}` },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$count" },
                },
            },
        ])
        .toArray();

    return {
        totalCount: totalToday[0]?.total || 0,
    };
};
