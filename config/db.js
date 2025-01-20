import mongoose from "mongoose";
export async function connectToDB(){
    try{
   await mongoose.connect(process.env.DB_URI)
   console.log("connect to db ")
    }
    catch(err){
       console.log(err.message) 
    }

} 