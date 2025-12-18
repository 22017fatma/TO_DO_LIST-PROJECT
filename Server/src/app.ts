import express from "express";

const app = express();


app.use(express.json());


app.get("/", (req, res) => {
  res.send("Server is running on port 3005");
});

export default app;
