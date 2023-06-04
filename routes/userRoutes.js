import express from "express";
import { accessRoles } from "../middleware/role.js";
import verifyToken from "../middleware/verifyToken.js";
import imageUpload from "../middleware/imageUpload.js";
import {
  getAllUsers,
  getUserById,
  getPaginatedUsers,
  getPaginatedTeachers,
  getFilteredPaginatedTeachers,
  getTeacherById,
  getNormalUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/userControllers.js";

const router = express.Router();

router.get("/", getAllUsers);
router.get("/users", getPaginatedUsers);
router.get("/teachers", getPaginatedTeachers);
router.get("/filterteachers", getFilteredPaginatedTeachers);
router.get("/:id", verifyToken, getUserById);
router.post("/signup", createUser);
router.post("/login", loginUser);
router.patch(
  "/:id",
  verifyToken,imageUpload,
  accessRoles(["User", "Teacher", "Admin"]),
  updateUser
);
router.delete(
  "/:id",
  verifyToken,
  accessRoles(["User", "Teacher", "Admin"]),
  deleteUser
);

export default router;
