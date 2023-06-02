import express from "express";
import {
  getAllReviews,
  getReviewById,
  getReviewsByShadowTeacherId,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewControllers.js";

const router = express.Router();

router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.get("/teacher/:id",  getReviewsByShadowTeacherId);
router.post("/", createReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
