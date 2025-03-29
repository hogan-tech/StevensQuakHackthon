import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export const addUser = async (userName, password) => {
    const usersCollection = await users();

    // 檢查是否已有同名使用者
    const existingUser = await usersCollection.findOne({ userName });
    if (existingUser) throw new Error("Username already exists");

    // 雜湊密碼
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        userName,
        password: hashedPassword,
    };

    const insertRes = await usersCollection.insertOne(newUser);
    if (!insertRes.insertedId) {
        throw new Error("Failed to insert user");
    }

    // 回傳新使用者（不含密碼）
    const user = await usersCollection.findOne(
        { _id: insertRes.insertedId },
        { projection: { password: 0 } }
    );

    return user;
};

export const loginUser = async (userName, password) => {
    const usersCollection = await users();

    // 1. 查找使用者
    const user = await usersCollection.findOne({ userName });
    if (!user) {
        throw new Error("User not found");
    }

    // 2. 驗證密碼
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }

    // 3. 回傳使用者（不包含密碼）
    const { password: _, ...safeUser } = user; // 移除 password 欄位
    return safeUser;
};
