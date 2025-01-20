import { Router } from "express"; 
import{ addCourse, deleteCourseById, getAllCourses, getCourseById, updateCourseById } from "../controller/course.js"

const router=Router()
router.get("/",getAllCourses)
router.get("/:id",getCourseById)
router.delete("/:id",deleteCourseById)
router.put("/:id",updateCourseById)
router.post("/" ,addCourse)

export default router;