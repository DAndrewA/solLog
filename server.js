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
    socket.on("logPush",function(user,entryName,log){
        pushLog(user,entryName,log);
    });
})

// listens over port 3000
http.listen(3000,function(){
    console.log("Server listning");
})

// the function to write the log entry
var pushLog = function(userName,entryName,log){
    db.put("users",userName+".entries."+entryName,{
        "title":entryName,
        "author":name,
        "log":log,
    }).then(function(res){
        console.log("Succesfully wrote " + userName + "\'s entry : " + entryName);
    });
}
