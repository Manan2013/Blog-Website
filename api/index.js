const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const post = require("./models/post");
const multer = require("multer");
const fs = require("fs");
const uploadMiddleware = multer({dest: "uploads/"});
const app = express();


var salt = bcrypt.genSaltSync(10);
var secret = "akdsjfhbrghrubfyhsubusfbsugbfsk";

app.use(cors({credentials: true,origin: "http://localhost:3000"}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect("mongodb+srv://itsmanan13:klgd2hLvCTkmPHgE@cluster0.upcefo2.mongodb.net/");

app.post("/register", async (req,res) => {
    const {username,password} = req.body;
    try{
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        });
        res.json(userDoc);
    } catch(e) {
        res.status(400).json(e);
    }
})

app.post("/login", async (req,res) => {
    const {username,password} = req.body;
    const userDoc =  await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk) {
        // logged in
        jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
            if (err) throw err;
            res.cookie("token", token).json({
                id:userDoc._id,
                username,
            });
        })
    } else {
        res.status(400).json("Wrong credentials");
    }
})

app.get("/profile", (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err,info) => {
        if (err) throw err;
        res.json(info);
    })
})

app.post("/logout", (req,res) => {
    res.cookie("token","").json("ok")
})

app.post("/post", uploadMiddleware.single("file"), async (req,res) => {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const {title,summary,content} = req.body;
    const postDoc = await post.create({
        title,
        summary,
        content,
        cover:newPath
    });
    res.json(postDoc);
});

app.listen(4000);
// mongodb+srv://itsmanan13:klgd2hLvCTkmPHgE@cluster0.upcefo2.mongodb.net/
// klgd2hLvCTkmPHgE