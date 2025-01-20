import { Router } from "express"; 
import { addRegistration, cancelRegistration, getAllRegistrations, getregistrationsByStudentId, updateIsSuccessfullyCompleted } from "../controller/registration.js";

const router=Router()

router.get("/",getAllRegistrations)
router.get("/:id",getregistrationsByStudentId)
router.post("/",addRegistration)
router.delete("/:id",cancelRegistration)
router.put("/:id",updateIsSuccessfullyCompleted)



export default router;