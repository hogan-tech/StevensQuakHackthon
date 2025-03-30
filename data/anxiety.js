import { anxiety } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

// export const addAnxiety = async (userName) => {
//     const anxietyCollection = await anxiety();
//     let newUser = {
//         name: userName,
//         count: 0,
//     };
//     const insertRes = await anxietyCollection.insertOne(newUser);
//     if (!insertRes) {
//         console.log(insertRes);
//     }
//     return insertRes.insertedId;
// };

// export const increaseAnxiety = async (userName) => {
//     const anxietyCollection = await anxiety();
//     const updateResult = await anxietyCollection.findOneAndUpdate(
//         { name: userName }, // Query condition
//         { $inc: { count: 1 } }, // Increment the count field by 1
//         { returnDocument: "after" } // Return the document after the update
//     );

//     if (!updateResult) {
//         throw `User not found`;
//     }

//     return updateResult;
// };

export const updateAnxietyCount = async (userName, day, time) => {
    const anxietyCollection = await anxiety();

    // Update or insert: increment count and push time into the array
    await anxietyCollection.updateOne(
        { userName, day },
        {
            $inc: { count: 1 },
            $push: { time: time },
        },
        { upsert: true }
    );

    // Fetch updated data for that user on that day
    const updatedDoc = await anxietyCollection.findOne({ userName, day });

    return {
        totalCount: updatedDoc?.count || 0,
        timeArray: updatedDoc?.time || [],
    };
};
