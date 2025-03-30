import anxietyRoutes from "./anxiety.js";
import usersRoute from "./users.js";
const constructorMethod = (app) => {
    app.use("/anxiety", anxietyRoutes);
    app.use("/users", usersRoute);
    app.use("*", (req, res) => {
        res.status(404).json({ error: "Hello World" });
    });
};

export default constructorMethod;
