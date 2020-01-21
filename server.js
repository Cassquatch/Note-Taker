//import necessary packages to stand up an express server and connect to the front end
const express = require("express");
const fs = require("fs");
const path = require("path");

//set up express
const app = express();

//set up dynamic port for hosting, but also a default
const PORT = process.env.PORT || 3000;

//set up middle ware to properly handle requests
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//add routes for js file / css file
app.get("/public/assets/css/styles.css", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/assets/css/styles.css"));
})
app.get("/public/assets/js/index.js", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/assets/js/index.js"));
})

//handle GET routes for the html
app.get("/notes", (req, res) => {
    //direct this route to the notes.html file
    res.sendFile(path.join(__dirname, "./notes.html"));
});

app.get("/", (req, res) => {
    //direct the home route to the index.html file
    res.sendFile(path.join(__dirname, "./index.html"));
});


//handle GET routes for the api
app.get("/api/notes", (req, res) => {
    //read the db.json file to get the saved notes and display them back
    fs.readFile("./db/db.json", (err, data) => {
        //throw error if present
        if (err) throw err;
        //parse data
        res.json(JSON.parse(data));
    });
});

//handle POST requests to actually save data into the db.JSON file
app.post("/api/notes", (req, res) => {
    //set up note_array and instantiate a newNote object with request body
    let note_array = [];
    let newNote = req.body;
    //read what is currently in db.json and store it in an array
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        //stringify data to put it in the array
        note_array = JSON.parse(data);

        //not working correctly, figure out a way to add ids to the notes so that when you click on them they show up
        if (note_array.length === 0) {
            let id = 0;
            newNote.id = id + 1;
        }
        if (note_array.length > 0) {
            let curr_length = note_array.length;
            newNote.id = note_array[curr_length - 1].id + 1;
        }

        note_array.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(note_array), (err) => {
            if (err) throw err;
        });
    });
    res.json(newNote);
});

//handle delete
app.delete("/api/notes/:id", (req, res) => {
    let note_id = parseInt(req.params.id);

    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;

        let notes_array = JSON.parse(data);

        for (let i = 0; i < notes_array.length; i++) {
            if (note_id === notes_array[i].id) {
                res.json(notes_array.splice(i, 1));
            }
        }

        fs.writeFile("./db/db.json", JSON.stringify(notes_array), (err) => {
            if (err) throw err;
        });
    });

});
//start listening on either the host port or default port that was set
app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});