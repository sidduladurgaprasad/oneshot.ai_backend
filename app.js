// require("dotenv").config();
// const cors = require('cors');
// const exp=require("express");
// const app=exp();

// app.use(exp.json())
// const PORT = process.env.PORT || 4000
// app.use(cors());
// let mclient=require("mongodb").MongoClient;

// let DBurl=process.env.DBurl;

// mclient.connect(DBurl)
// .then((client)=>{
//     let dbobj=client.db("oneshot");
//     let userCollectionObj=dbobj.collection("users");
//     app.set("userCollectionObj",userCollectionObj);
//     console.log("DB connection success");
// })
// .catch((error)=>{
//     console.log("Error in DB connection");
// })





// app.get("/get-user",async(request,response)=>{
//     let userCollectionObj=app.get("userCollectionObj");
//     let users=await userCollectionObj.find().toArray();
//     response.send({message:"All users",payload:users});
// })

// app.post("/post-user",async(request,response)=>{
//     let obj=request.body;
//     console.log(obj);
//     let userCollectionObj=app.get("userCollectionObj");
//     await userCollectionObj.insertOne(obj);
//     response.send({message:"user created successfully"})
// })


// app.listen(PORT,()=>{
//     console.log("Server listening on port 4000");
// })


require("dotenv").config();
const cors = require('cors');
const express = require("express"); // Changed "exp" to "express" for clarity
const app = express();

app.use(express.json()); // Used "express" instead of "exp" for better readability
app.use(cors());

const PORT = process.env.PORT || 4000;
let mclient = require("mongodb").MongoClient;

let DBurl = process.env.DBurl;

mclient.connect(DBurl)
  .then((client) => {
    let dbobj = client.db("oneshot");
    let userCollectionObj = dbobj.collection("users");
    app.set("userCollectionObj", userCollectionObj);
    console.log("DB connection success");
  })
  .catch((error) => {
    console.log("Error in DB connection:", error); // Added the error message for better debugging
  });

app.get("/get-user", async (request, response) => {
  let userCollectionObj = app.get("userCollectionObj");
  try {
    let users = await userCollectionObj.find().toArray();
    response.send({ message: "All users", payload: users });
  } catch (error) {
    response.status(500).send({ message: "Error retrieving users", error: error.message });
  }
});

app.post("/post-user", async (request, response) => {
  let obj = request.body;
  console.log(obj);
  let userCollectionObj = app.get("userCollectionObj");
  try {
    await userCollectionObj.insertOne(obj);
    response.send({ message: "User created successfully" });
  } catch (error) {
    response.status(500).send({ message: "Error creating user", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
