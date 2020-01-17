//import necessary packages to create/handle routes and save data

const fs = require("fs");

module.exports = function(app){
    //handle GET requests to the api routes

    app.get("/api/notes", (req, res) => {
        //read the db.json file to get the saved notes and display them back

        fs.readFile("../../db/db.JSON", (err, data) => {
            //throw error if present
            if (err) throw err;
            console.log(data);
            //stringify data
            let data_str = JSON.stringify(data);
            console.log(data_str);


        });
    });
}

