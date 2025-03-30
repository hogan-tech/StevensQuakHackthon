import { anxiety } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

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

export const getAnxietyCountToday = async (userName, day) => {
    const anxietyCollection = await anxiety();

    const result = await anxietyCollection.findOne({ userName, day });

    return {
        day: day,
        count: result?.count || 0,
        time: result?.time || [],
    };
};

export const getAnxietyCountSevenDays = async (userName, day) => {
    const anxietyCollection = await anxiety();

    const endDate = new Date(day);
    const startDate = new Date(day);
    startDate.setDate(endDate.getDate() - 6); // 6 days before, so total 7 days

    const toDateString = (d) => d.toISOString().slice(0, 10);
    const startStr = toDateString(startDate);
    const endStr = toDateString(endDate);

    const result = await anxietyCollection
        .find({
            userName,
            day: { $gte: startStr, $lte: endStr },
        })
        .sort({ day: 1 }) // optional: sort by day ascending
        .toArray();

    return result.map((entry) => ({
        day: entry.day,
        count: entry.count || 0,
        time: entry.time || [],
    }));
};
