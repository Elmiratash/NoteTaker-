const express = require("express");
let [{ noteList, counter }] = require("./db/db.json");
const PORT = process.env.PORT || 3001;
const path = require("path");
const fs = require("fs");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/api/notes", (req, res) => {
    res.json(noteList);
});

app.post("/api/notes", (req, res) => {
    const newNote = req.body;
    createNewNote(newNote, noteList);
    res.json(newNote);
});
app.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;

    const projectIndex = noteList.findIndex((note) => note.id == id);

    noteList.splice(projectIndex, 1);

    saveFile(noteList);

    return res.send();
});

function saveFile(newArr) {
    for (let i = 0; i < newArr.length; i++) {
        newArr[i].id = JSON.stringify(counter);
        counter++;
    }
    newArr = [{ noteList: newArr, counter: counter }];
    fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(newArr, null, 2)
    );
}

function createNewNote(body, notes) {
    const note = body;
    notes.push(note);
    saveFile(noteList);
}

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});