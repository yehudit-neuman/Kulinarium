import { Router } from "express"; 
import{ addStudent_signUp, getAllStudents, getStudentById, getStudetByUserNamePassword_Login, updateStudentById, updateStudentPasswordById } from "../controller/student.js"

const router=Router()
router.get("/",getAllStudents)
router.get("/:id",getStudentById)
router.post("/",addStudent_signUp)
router.put("/:id",updateStudentById)
router.put("/:id" ,updateStudentPasswordById)
router.post("/login" ,getStudetByUserNamePassword_Login)

export default router;