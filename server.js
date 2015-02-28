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
        valid = login(data.name,data.password);
        socket.emit("login "+data.name+" "+data.password,valid);
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

// the function that handles accesing the users password and validating it
var login = function(name,password){
    db.get("users",name)
    // checks to see whether the password is valid
    .then(function(res){
        if(password === res.body.password){
            console.log("login succesful");
            return true
        }
        else{
            console.log("password incorrect");
            return "password"
        }
    })
    // will only run if the name is invalid
    .fail(function(err){
        console.log("username incorrect");
        return "username"
    })
}
