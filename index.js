import express from "express";
import axios from "axios";

console.log("hello world");

const app = express();

app.get("/info", (req, res) => {
  res.send("hello world");
});

app.get("/axios", async (req, res) => {
  const response = await axios.get("http://localhost:8080/info");
  res.send(response.data);
});

app.listen("8080");
