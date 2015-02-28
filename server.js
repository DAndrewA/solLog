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
})

// listens over port 3000
http.listen(3000);

// the function to write the log entry
var pushLog = function(userName,entryName,log){
    // merges the log into the users object
    db.merge("users",userName,{
        "logs":{
            entryName:{
                "title":entryName,
                "log":log,
            },
        },
    })
    .then(function(res){
        console.log("Succesfully wrote " + userName + "\'s entry : " + entryName);
    });
}
