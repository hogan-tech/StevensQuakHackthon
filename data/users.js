import { users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export const addUser = async (userName, password) => {
    const usersCollection = await users();

    // Check if a user with the same username already exists
    const existingUser = await usersCollection.findOne({ userName });
    if (existingUser) throw new Error("Username already exists");

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        userName,
        password: hashedPassword,
    };

    const insertRes = await usersCollection.insertOne(newUser);
    if (!insertRes.insertedId) {
        throw new Error("Failed to insert user");
    }

    // Return the new user (without the password)
    const user = await usersCollection.findOne(
        { _id: insertRes.insertedId },
        { projection: { password: 0 } }
    );

    return user;
};

export const loginUser = async (userName, password) => {
    const usersCollection = await users();

    // 1. Find the user
    const user = await usersCollection.findOne({ userName });
    if (!user) {
        throw new Error("User not found");
    }

    // 2. Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }

    // 3. Return the user (excluding the password)
    const { password: _, ...safeUser } = user; // Remove the password field
    return safeUser;
};
