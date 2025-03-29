import express from "express";
import cool from "cool-ascii-faces";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello from Heroku!");
});

app.get("/cool", (req, res) => {
  console.log(`Rendering a cool ascii face for route '/cool'`);
  res.send(cool());
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
