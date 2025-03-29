//An index file that returns a function that attaches all your routes to your app
//Lecture Code Refernece -> https://github.com/stevens-cs546-cs554/CS-546/blob/master/lecture_05/routes/index.js
// import authorsRoutes from "./authors.js";

import anxietyRoutes from "./anxiety.js";
import usersRoute from "./users.js";
const constructorMethod = (app) => {
    app.use("/anxiety", anxietyRoutes);
    app.use("/users", usersRoute);
    app.use("*", (req, res) => {
        res.status(404).json({ error: "Not found" });
    });
};

export default constructorMethod;
