import { anxiety } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const addAnxiety = async (userName) => {
    const anxietyCollection = await anxiety();
    let newUser = {
        name: "wesley",
        count: 0,
    };
    const insertRes = await anxietyCollection.insertOne(newUser);
    if (!insertRes) {
        console.log(insertRes);
    }
    return insertRes.insertedId;
};

export const increaseAnxiety = async () => {
    const anxietyCollection = await anxiety();
    const updateResult = await anxietyCollection.findOneAndUpdate(
        { name: "wesley" }, // 查詢條件
        { $inc: { count: 1 } }, // 將 count 欄位 +1
        { returnDocument: "after" } // 更新後回傳的 document
    );

    if (!updateResult) {
        throw `User not found`;
    }

    return updateResult;
};
