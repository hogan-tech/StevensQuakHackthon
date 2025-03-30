import express from "express";
import cool from "cool-ascii-faces";
import configRoutes from "./routes/index.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// testing
app.options("*", cors());

// app.use(
//     cors({
//         origin: "https://hogan-tech.github.io", // Or use "*" to allow all origins (not recommended for production)
//         methods: ["GET", "POST", "PUT", "DELETE"],
//         credentials: true, // Set to true if you are using cookies or need authentication
//     })
// );

app.use(express.json());

configRoutes(app);

app.get("/", (req, res) => {
    res.send("Hello from Heroku!");
});

// app.get("/cool", (req, res) => {
//     console.log(`Rendering a cool ascii face for route '/cool'`);
//     res.send(cool());
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
