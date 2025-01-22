import mongoose from "mongoose"

import { registrationeModel } from "../model/registration.js"
import { studentModel } from "../model/student.js"
import { courseModel } from "../model/course.js"

export const getAllRegistrations = async (req, res) => {//מחזירה את כל הרישומים לקורסים	

    try {
        let data = await registrationeModel.find();
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant get all", message: err.message })
    }
}


export const addRegistration = async (req, res) => {//מוסיפה רישום חדש לdb בתנאי שהוא חוקי מכל בחינה ומחזירה אותו	
    let { body } = req;
    if (!body.studentId || !body.courses || body.courses.length == 0)
        return res.status(400).json({ title: "cant add registration", message: "required details are missing" })
    try {
        //בדיקה בעבור כל קורס האם הוא מכיל id 
        //והאם הוא קיים בDB החזרת שגיאות בהתאם
        for (const course of body.courses) {
            if (!course.courseId) {
                return res.status(400).json({
                    title: "Invalid Course",
                    message: "Course details are missing or invalid"
                });
            }
            const courseExists = await courseModel.findById(course.courseId);
            if (!courseExists) {
                return res.status(404).json({
                    title: "Course Not Found",
                    message: `No course found with ID: ${course.courseId}`
                });
            }

        }
        let student = await studentModel.findById(body.studentId)
        if (!student)
            return res.status(404).json({ title: "cant add registration", message: "No student exists with the code received" })
        let neweRgistration = new registrationeModel(body)
        let data = await neweRgistration.save()
        res.json(data)
    }
    catch (err) {
        return res.status(400).json({ title: "cant add registration", message: err.message })
    }
}

export const cancelRegistration = async (req, res) => {//מבטלת רישום על פי הid בתנאי שהוא עדיין לא הושלם בהצלחה ומחזירה את הרישום המבוטל	
    let { id } = req.params
    if (!mongoose.isValidObjectId)
        return res.status(500).json({ Title: "caanot cancel registration", message: "the id you sent was not valid" })
    try {
        let registration = await registrationeModel.findById(id)
        if (!registration)
            return res.status(404).json({ Title: "caanot cancel registration", message: "the id you sent was not found" })
        //אם הרישום לקורס הושלם סופית לא ניתן לבטל רישום
        if (registration.isSuccessfullyCompleted)
            return res.status(404).json({ Title: "caanot cancel registration", message: "the registration isSuccessfullyCompleted" })
        await registration.deleteOne()
        return res.json(registration)
    }
    catch (err) {
        return res.status(400).json({ Title: "caanot cancel registration", message: err.message })
    }
}
export const getregistrationsByStudentId = async (req, res) => {//מחזירה את כל הרישומים של תלמיד מסוים על פי הid אם קיימים כאלה	
    let { id } = req.params
    try {
        let registrations = await registrationeModel.find({ studentId: id })
        if (registrations.length==0)
            return res.status(404).json({ Title: "caanot get all registrations By studentId", message: "The student code you sent belongs to a student who is not enrolled in any course" })
        res.json(registrations)
    }
    catch (err) {
        return res.status(400).json({ Title: "caanot get all registrations By studentId", message: err.message })
    }
}

export const updateIsSuccessfullyCompleted=async (req,res)=>{//מעדכנת את סטאטוס הרישום על פי הid לפרמטר שהתקבל בbody ומחזירה את הרישום המעודכן	
    let {id}=req.params
    if(!mongoose.isValidObjectId)
        return res.status(500).json({ Title: "caanot updateIsSuccessfullyCompleted", message:"the id you sent was not valid"})
    if(!req.body.isSuccessfullyCompleted)
        return res.status(404).json({ Title: "caanot updateIsSuccessfullyCompleted", message:"the status to change to, is required"})
    try{
      let registration=await registrationeModel.findByIdAndUpdate(id,{isSuccessfullyCompleted:req.body.isSuccessfullyCompleted},{new:true})
      if(!registration)
        return res.status(404).json({ Title: "caanot update registration", message:"the id you sent is not found"})
      return res.json(registration)
    }
    catch(err){
      return res.status(400).json({ Title: "caanot update status", message: err.message})
    }
}




