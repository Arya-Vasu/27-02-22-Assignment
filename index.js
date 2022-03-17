import express from "express";
import fs from "fs";
import { MongoClient } from "mongodb";

// Creating connectin between Mongo and Node
const MONGO_URL = "mongodb://localhost";

async function createCollection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  return client;
}

const client = await createCollection();

const app = express();
const PORT = 4000;


// Following lines of code will run when the URL will contain "/current-timestamp" in it at the end.

app.get("/current-timestamp", async function (req, res) {  // API endpoint -> /current-timestamp
  const data = new Date().getTime();  // GEtting Current Timestamp

  fs.writeFile(`./File Folder/${data}.txt`, data.toString(), (err) => {  // Creating file "<timestamp as a name>" in a folder "File Folder" and converting the timestamp into String value.
    if (err) {
      console.error(err);  // If error occurs
      return; // Program will terminate if error is occured.
    }
    console.log("File created.");
  });

  const stamp = await client
    .db("Node-1-Assignment")
    .collection("timestamp")
    .insertOne({ timestamp: data.toString() });  // Inserting the Timestamp in a Database

  res.send(
    "A file has been created with current timestamp in File Folder and a document has been added in a Database.!!!"
  );
});


// Following lines of code will run when the URL will contain "/current-timestamp/fetch-all-files" in it at the end.

app.get("/current-timestamp/fetch-all-files", async function (req, res) {  // API endpoint -> /current-timestamp/fetch-all-files
  const allData = await client
    .db("Node-1-Assignment")
    .collection("timestamp")
    .find({})  // Fetching the Data from the Database.
    .toArray();  // Converting the data into an Array.
  
  res.send(allData);
});

app.listen(PORT, () => console.log(`Server started in ${PORT}`));
