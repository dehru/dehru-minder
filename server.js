var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var COURSES_COLLECTION = "courses";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }

    // Save database object from the callback for reuse.
    db = database;
    console.log("Database connection ready");

    // Initialize the app.
    var server = app.listen(process.env.PORT || 8080, function () {
        var port = server.address().port;
        console.log("App now running on port", port);
    });
});

// COURSES API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

/*  "/courses"
 *    GET: finds all courses
 *    POST: creates a new contact
 */

app.get("/courses/:uuid", function(req, res) {
});

app.post("/courses/:uuid", function(req, res) {
    var newCourse = req.body;
    newCourse.createDate = new Date();
    newCourse.uuid = req.uuid;

    if (!(req.body.name || req.body.icon)) {
        handleError(res, "Invalid user input", "Must provide a name and icon.", 400);
    }

    db.collection(COURSES_COLLECTION).insertOne(newCourse, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/*  "/courses/:id"
 *    GET: find contact by id
 *    PUT: update contact by id
 *    DELETE: deletes contact by id
 */

app.get("/courses/:uuid", function(req, res) {
    db.collection(COURSES_COLLECTION).find(req.uuid, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(200).json(doc);
        }
    });
    
});

app.put("/courses/:id", function(req, res) {
});

app.delete("/courses/:id", function(req, res) {
});