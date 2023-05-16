import express from "express";
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherControllers.js";

const router = express.Router();

router.get("/", getAllTeachers);
router.get("/:id", getTeacherById);
router.post("/", createTeacher);
router.put("/:id", updateTeacher);
router.delete("/:id", deleteTeacher);

export default router;
