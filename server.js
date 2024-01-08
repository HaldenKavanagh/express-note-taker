const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const db = require("./db/db.json");

const { v4: uuidv4 } = require("uuid");

// middleware

app.use(express.static("public"));
app.use(express.json());

// api routes

// get route for /api/notes to retrieve the db.json file

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;
    let dbData = JSON.parse(data);
    res.json(dbData);
  });
});

// post route to recieve a new note and post it to the body and append it to the db.json file

app.post("/api/notes", (req, res) => {
  const db = JSON.parse(fs.readFileSync("./db/db.json"));
  const newNote = req.body;
  newNote.id = uuidv4();
  db.push(newNote);
  fs.writeFileSync("./db/db.json", JSON.stringify(db));
  res.json(db);
});

// delete path to remove a note from the db.json, saving it and then displaying the new db.json to the body

app.delete("/api/notes/:id", (req, res) => {
  const db = JSON.parse(fs.readFileSync("./db/db.json"));
  // creates a new array called newDb bu using the filter method to add only the notes not equal to the note to be deleted

  const newDb = db.filter((note) => note.id !== req.params.id);
  console.log(newDb);

  // writes the newDb to the db.json file

  fs.writeFileSync("./db/db.json", JSON.stringify(newDb));

  // returns the updated db file

  res.json(newDb);
});

// get route to display the index.html to the viewport when the user enters the page

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

// get route to display the notes.html to the viewport when the user is at /notes

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.listen(PORT, () => console.log(`App listening on ${PORT}`));
