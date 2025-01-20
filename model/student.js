import { Schema, model } from "mongoose";



const studentSchema = Schema({
    email: {
        type: String,
        match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    },
    userName: { type: String,required:true},
    password: { type: String, required: true },
    role: {
        type: String,
        default: "USER",
        enum: ['USER', 'ADMIN']
    },
    registrationDate:{type:Date,default:new Date()}
})
export const studentModel = model("student", studentSchema,"students");


