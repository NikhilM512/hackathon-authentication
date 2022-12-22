
 const express=require("express");
 const jwt = require("jsonwebtoken")
 const bcrypt = require('bcrypt');
 const { connection } = require("./Config/db");
 const {UserModel}=require("./Models/User.model")

 require('dotenv').config()

 const app=express();
 app.use(express.json())

 app.get("/",(req,res)=>{
    res.send("welcome")
 })

 app.post("/signup", async (req, res) => {
   console.log(req.body)
   const {email,password,age,name} = req.body;
   const userPresent = await UserModel.findOne({email})
   //TODO
   console.log(userPresent)
   if(userPresent?.email){
       res.send("User already signup, Try to Login")
   }
   else{
       try{
           bcrypt.hash(password, 4, async function(err, hash) {
               const user = new UserModel({email,password:hash,age,name})
               await user.save()
               res.send("Sign up successfull")
           });
          
       }
      catch(err){
           console.log(err)
           res.send("Something went wrong, pls try again later")
      }
   }
   
})

app.post("/login", async (req, res) => {
   const {email, password} = req.body;
   try{
       const user = await UserModel.find({email})
        
     if(user.length > 0){
       const hashed_password = user[0].password;
       bcrypt.compare(password, hashed_password, function(err, result) {
           if(result){
               const token = jwt.sign({"userID":user[0]._id},  process.env.SECRET_KEY);
               res.send({"msg":"Login successfull","token" : token})
           }
           else{
               res.send("Please SignUp First")
           }
     })} 
     else{
       res.send("Login failed")
     }
   }
   catch{
       res.send("Something went wrong, please try again later")
   }
})



 app.listen(8080, async () => {
   try{
       await connection;
       console.log("Connected to DB Successfully")
   }
   catch(err){
       console.log("Error connecting to DB")
       console.log(err)
   }
   console.log("Listening on PORT 8080")
})



