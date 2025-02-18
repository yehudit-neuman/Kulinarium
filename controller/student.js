import { studentModel } from "../model/student.js"


export const getAllStudents = async (req, res) => {//מחזירה את כל התלמידים ללא הסיסמאות	

    try {
        let data = await studentModel.find().select('-password');
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant get all", message: err.message })
    }
}


export const getStudentById = async (req, res) => {//מחזירה תלמיד מסוים על פי הid אם קיים ללא הסיסמה	
    let { id } = req.params;
    try {
        let data = await studentModel.findById(id).select('-password');
        if (!data)
            return res.status(404).json({ title: "can't get by id", message: "id not found" })
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant get by id", message: err.message })
    }
}

export const addStudent_signUp = async (req, res) => {//מוסיפה תלמיד חדש לdb בתנאי שהוא לא קיים עד כה בdb ומחזירה אותו	
    let { body } = req;
    //בדיקות תקינות שונות
    if (!body.userName || !body.password)
        return res.status(400).json({ title: "cant add student", message: "required details are missing" })
    if (body.userName.length < 3)
        return res.status(400).json({ title: "cant add Student", message: "your userName is too short" })
    if (body.password.length < 8)
        return res.status(400).json({ title: "cant add Student", message: "the password must be at least 8 charcters " })
    try {
        //בדיקה האם קיים תלמיד זהה בDB
        let exsistStudent = await studentModel.findOne({ userName: body.userName }).select('-password')
        if (exsistStudent)
            return res.status(409).json({ title: "cant add student", message: "userName already exsist" })
        let student = new studentModel(body)

        let data = await student.save();
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant add Student", message: err.message })
    }
}



export const updateStudentById = async (req, res) => {//מעדכנת תלמיד על פי הid בתנאי שלא מנסים לעדכן סיסמה ומחזירה את התלמיד המעודכן	
    let { id } = req.params
    let { body } = req;
    //בדיקות תקינות שונות 
    if (body.userName && body.userName.length < 3)
        return res.status(400).json({ title: "cant update student", message: "your userName is too short" })
    if (body.password)
        return res.status(404).json({ title: "cant update student", message: "cant updatet password" })
    if (body.role && !['USER', 'ADMIN'].includes(body.role))
        return res.status(400).json({ title: "cant update student", message: "role must be either 'USER' or 'ADMIN'" });

    try {

        let data = await studentModel.findByIdAndUpdate(id, body, { new: true }).select('-password');
        if (!data)
            return res.status(404).json({ title: "cant update student", message: "id not found " })
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant update student", message: err.message })
    }
}




export const updateStudentPasswordById = async (req, res) => {//מעדכנת את סיסמת התלמיד על פי הid לסיסמה שהתקבלה בbody ומחזירה את התלמיד המעודכן ללא הסיסמה	
    let { id } = req.params
    let { body } = req;
    //החזרת שגיאה אם לא התקבה סיסמה חדשה
    if (!body.password)
        return res.status(404).json({ title: "cant update student", message: " password is missing" })
    if(body.password.length<8)
        return res.status(404).json({ title: "cant update student", message: " password is too short" })
    //בדיקה האם התקבלו נתונים נוספים מלבד הסיסמה
    //והחחזרת שגיאות בהתאם
    const allowedFields = ['password']; // רשימת השדות המורשים
    const bodyKeys = Object.keys(body); // רשימת השדות ב-body

    const invalidFields = bodyKeys.filter(field => !allowedFields.includes(field)); // מצא שדות שלא נמצאים ברשימה המורשית

    if (invalidFields.length > 0) {
        return res.status(400).json({
            title: "cant update student",
            message: `Invalid fields: ${invalidFields.join(', ')}`, // הצג את השדות הלא חוקיים
        });

    }
    try {

        let data = await studentModel.findByIdAndUpdate(id, body, { new: true }).select('-password');
        if (!data)
            return res.status(404).json({ title: "cant update student password", message: "id not found " })
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant update student", message: err.message })
    }
}



export const getStudetByUserNamePassword_Login = async (req, res) => {//מחזירה תלמיד על פי סיסמה ושם שהתקבלו בצורה מאובטחת-body	
    let { userName,password } = req.body;
    if (!userName || !password)
        return res.status(400).json({ title: "cant login student", message: "required details are missing" })
    try {
        let student = await studentModel.findOne({ userName: userName}).select('-password')
        if (!student)
            return res.status(404).json({ title: "cant login student", message: "No student found with the username  received" })
        if(student.password!=password)
            return res.status(404).json({ title: "cant login student", message: "wrong password " })


        res.json(student);
    }
    catch (err) {
        res.status(400).json({ title: "cant login Student", message: err.message })
    }
}
