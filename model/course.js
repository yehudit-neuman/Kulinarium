import { Schema,model } from "mongoose";



const courseSchema=Schema({
name:{type:String,required:true},
description:String,
dateOpen:{type:Date,default: new Date()},
url:String,
price:{type:Number,default:400},
teachersNames:{type:[String],required:true},
categories:[String],

})
export const courseModel= model("course",courseSchema,"courses");


