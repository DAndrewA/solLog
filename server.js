// set up for rest of app
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);

// set up for orchestrate database
token = "d162aaf9-13a4-4f3d-8de3-f6fe1778c13e";
var db = require("orchestrate")(token);

// serves html file
app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

// sends request to db every time someone connects
io.on("connection",function(socket){
    console.log("User connected");

    // pushes a log on a logPush event
    socket.on("logPush",function(data){
        // data is a json object
        pushLog(data.name,data.logEntry,data.log);
    })

    // handles the login process
    socket.on("login",function(data){
        // acceses the database to get the username and password
        db.get('users', data.name)
        .then(function(res){
            if(res.body.password === data.password){
                // returns true if the database finds the user and the password is correct
                console.log("login succesful")
                socket.emit("login"+data.name+" "+data.password,true);
            }
            else{
                // if the user exists but the password is wrong, it returns password
                console.log("password incorrect")
                socket.emit("login"+data.name+" "+data.password,"password");
            }
        })
        .fail(function(err){
            // if the user doesn't exist, it will return username
            console.log("name incorrect")
            socket.emit("login"+data.name+" "+data.password,"username");
        })
        .done();

    })
})

// listens over port 3000
http.listen(3000);

// the function to write the log entry
var pushLog = function(userName,entryName,log){
    // merges the log into the users object
    db.post("logs",{
            "title":entryName,
            "author":userName,
            "log":log,
    })
    .then(function(res){
        console.log("Succesfully wrote " + userName + "\'s entry : " + entryName);
    })
}
