const express = require("express");
const { spawn } = require("child_process");
const path = require("path");
const cors = require("cors"); // Import the cors package
const app = express();
const port = 1000;

app.use(cors()); // Use the cors middleware to enable CORS support

app.use(express.json());

app.post("/solve", (req, res) => {
  const data = req.body;

  res.header("Access-Control-Allow-Origin", "*");

  // Use a relative path to run the Python script in the same folder
  const pythonProcess = spawn("python3", [
    path.join(__dirname, "logic_generator.py"),
    JSON.stringify(data),
  ]);

  pythonProcess.stdout.on("data", (data) => {
    const result = JSON.parse(data.toString());
    res.json(result);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
    res.status(500).json({ error: "Internal Server Error" });
  });
});

app.post("/discovery", (req, res) => {
  const data = req.body;

  res.header("Access-Control-Allow-Origin", "*");

  // Use a relative path to run the Python script in the same folder
  const pythonProcess = spawn("python3", [
    path.join(__dirname, "logic_discovery.py"),
    JSON.stringify(data),
  ]);

  pythonProcess.stdout.on("data", (data) => {
    const result = JSON.parse(data.toString());
    res.json(result);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(data.toString());
    res.status(500).json({ error: "Internal Server Error" });
  });
});

app.listen(port, () => {
  console.log(`Node.js server is running on port ${port}`);
});
