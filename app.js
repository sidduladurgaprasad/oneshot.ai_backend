require("dotenv").config();
const exp=require("express");
const app=exp();

app.use(exp.json())
const PORT = process.env.PORT || 4000

let mclient=require("mongodb").MongoClient;

let DBurl=process.env.DBurl;

mclient.connect(DBurl)
.then((client)=>{
    let dbobj=client.db("oneshot");
    let userCollectionObj=dbobj.collection("users");
    app.set("userCollectionObj",userCollectionObj);
    console.log("DB connection success");
})
.catch((error)=>{
    console.log("Error in DB connection");
})





app.get("/get-user",async(request,response)=>{
    let userCollectionObj=app.get("userCollectionObj");
    let users=await userCollectionObj.find().toArray();
    response.send({message:"All users",payload:users});
})

app.post("/post-user",async(request,response)=>{
    let obj=request.body;
    console.log(obj);
    let userCollectionObj=app.get("userCollectionObj");
    await userCollectionObj.insertOne(obj);
    response.send({message:"user created successfully"})
})


app.listen(4000,()=>{
    console.log("Server listening on port 4000");
})