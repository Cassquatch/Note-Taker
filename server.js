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

//point to route files for handling
// require("./public/assets/routes/api-routes")(app);
// require("./public/assets/routes/html-routes")(app);

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

    fs.readFile("./db/db.JSON", (err, data) => {
        //throw error if present
        if (err) throw err;
        //parse data
        let parsed_data = JSON.parse(data);
        
        
        res.json(parsed_data);

    });
});

// app.get("/notes/:id", (req, res) => {
    

//     fs.readFile("./db/db.json", (err, data) => {
//         if (err) throw err;
//         let note_array = JSON.parse(data);
        
//         for(note in note_array){
            
//         }

//     })
    
// })

//handle POST requests to actually save data into the db.JSON file
app.post("/api/notes", (req, res) => {
    
    let note_array = [];
    let newNote = req.body;
    
    //read what is currently in db.json and store it in an array
    fs.readFile("./db/db.json", (err, data) => {
        if (err) throw err;
        
        console.log(JSON.parse(data));
        //stringify data to put it in the array
        note_array = JSON.parse(data);
        
        //not working correctly, figure out a way to add ids to the notes so that when you click on them they show up
        
         if(note_array.length === null){
             let id = 0;
             newNote.id = id + 1;
         }
         if(note_array.length > 0){
            let curr_length = note_array.length;

             newNote.id = note_array[curr_length-1].id + 1;
         }
        
        
        note_array.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(note_array), (err) => {
            if (err) throw err;
            
        });
    });
    console.log(newNote);
    res.json(newNote);
    //write new file with the array
   
});

//handle delete
app.delete("/api/notes:id", (req, res) => {
    let note_id = req.params.id;

    
});
//start listening on either the host port or default port that was set
app.listen(PORT, () => {
    console.log(`App listening on PORT: ${PORT}`);
});