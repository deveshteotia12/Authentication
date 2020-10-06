require('dotenv').config()
const express = require("express");
const bodyParser= require("body-parser");
const ejs= require("ejs");
const mongoose=require("mongoose");
const encrypt = require("mongoose-encryption");
const app=express();
mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
const mySchema=mongoose.Schema({
    Email: String,
    Password: String,
})

mySchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields: ["Password"]});
const User=new mongoose.model("User",mySchema);
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));


app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})
app.post("/register",function(req,res){
     var obj={
         Email: req.body.username,
         Password: req.body.password
     };
     const newUser=new User(obj);
     newUser.save().then(()=>res.render("secrets"))
     .catch((err)=>console.log(err))
})
app.post("/login",function(req,res){
    var email=req.body.username;
    var password=req.body.password;
    console.log(req.body);
    User.findOne({Email: email},function(err,doc){
        console.log(doc);
        if(doc)
        {
            if(doc.Password===password)
            {
                res.render("secrets");
            }
            else{
                res.render("login");
            }
        }
        else{
            res.render("login");
        }
    })
})





app.listen(3000,()=>(console.log("Listening to port 3000")));