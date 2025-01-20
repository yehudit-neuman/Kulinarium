import { courseModel } from "../model/course.js"
export const getAllCourses = async (req, res) => {

    try {
        let data = await courseModel.find();
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant get all", message: err.message })
    }
}
export const getCourseById = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await courseModel.findById(id);
        if (!data)
            return res.status(404).json({ title: "cant get by id", message: "id not found" })
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant get by id", message: err.message })
    }
}
export const addCourse = async (req, res) => {
    let { body } = req;
    if (!body.name || !body.teachersNames || body.teachersNames.length == 0)
        return res.status(400).json({ title: "cant add course", message: "required details are missing" })
    if (body.name.length < 3)
        return res.status(400).json({ title: "cant add course", message: "your name is too short" })
    if (body.price < 400)
        return res.status(400).json({ title: "cant add course", message: "the price must be at least 400 " })
    try {
        let course = new courseModel(body)
        let data = await course.save();
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant add course", message: err.message })
    }
}



export const deleteCourseById = async (req, res) => {
    let { id } = req.params;
    try {
        let data = await courseModel.findByIdAndDelete(id);
        if (!data)
            return res.status(404).json({ title: "cant delete by id", message: "id not found" })
        res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant delete by id", message: err.message })
    }
}


export const updateCourseById = async (req, res) => {
    let { id } = req.params
    let { body } = req;
    if (body.name && body.name.length < 3)
        return res.status(400).json({ title: "cant update course", message: "your name is too short" })
    if (body.price && body.price < 400)
        return res.status(400).json({ title: "cant update course", message: "the price must be at least 400 " })
    try {

        let data = await courseModel.findByIdAndUpdate(id, body, { new: true });
        if (!data)
            return res.status(404).json({ title: "cant update course", message: "id not found "})
            res.json(data);
    }
    catch (err) {
        res.status(400).json({ title: "cant update course", message: err.message })
    }
}


