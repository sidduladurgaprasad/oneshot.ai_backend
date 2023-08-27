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
const { ObjectId } = require("mongodb");
const app = express();

app.use(express.json()); // Used "express" instead of "exp" for better readability
app.use(cors(
    {
        origin: '*'
    }
));

const PORT = process.env.PORT || 4000;
let mclient = require("mongodb").MongoClient;

let DBurl = process.env.DBurl;

mclient.connect(DBurl)
  .then((client) => {
    let dbobj = client.db("oneshot");
    let userCollectionObj = dbobj.collection("users");
    let bookingCollectionObj = dbobj.collection("bookings")
    app.set("bookingCollectionObj",bookingCollectionObj);
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

app.get("/get-booking", async (request, response) => {
  let bookingCollectionObj = app.get("bookingCollectionObj");
  try {
    let bookings = await bookingCollectionObj.find().toArray();
    response.send({ message: "All bookings", payload: bookings });
  } catch (error) {
    response.status(500).send({ message: "Error retrieving booking data", error: error.message });
  }
});

app.post("/post-booking", async (request, response) => {
  let obj = request.body;
  console.log(obj);
  let bookingCollectionObj = app.get("bookingCollectionObj");
  try {
    await bookingCollectionObj.insertOne(obj);
    response.send({ message: "booking created successfully" });
  } catch (error) {
    response.status(500).send({ message: "Error booking slot", error: error.message });
  }
});
app.delete("/delete-booking/:id", async (request, response) => {
  let bookingCollectionObj = app.get("bookingCollectionObj");
  let id = request.params.id; // Use request.params.id to get the ID from the URL parameter
  console.log(id);
  try {
    let bookings = await bookingCollectionObj.deleteOne({ "_id":id }); // Make sure to use ObjectId to convert the ID to MongoDB ObjectId
    response.send({ message: "Booking deleted" });
  } catch (error) {
    response.status(500).send({ message: "Error deleting slot", error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
