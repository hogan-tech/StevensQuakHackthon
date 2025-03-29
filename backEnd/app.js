import express from "express";
import constructorMethod from "./routes/index.js";

const app = express();

constructorMethod(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});
