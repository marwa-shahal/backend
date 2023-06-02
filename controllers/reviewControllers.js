import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    // Retrieve all reviews from the database
    const reviews = await Review.find();
    console.log(reviews);
    // Return the reviews as a response
    res.status(200).json(reviews);
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get a single review by ID
export const getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to get the review" });
  }
};

export const getReviewsByShadowTeacherId = async (shadowTeacherId) => {
  try {
    const reviews = await Review.find({ shadow_teacher_id: shadowTeacherId })
      .populate("reviewer_id")
      .exec();
    return reviews;
  } catch (error) {
    // Handle the error
  }
};

// Create a new review
export const createReview = async (req, res) => {
  const { shadow_teacher_id, reviewer_id, reviewText, rating } = req.body;
  try {
    const review = await Review.create({
      shadow_teacher_id,
      reviewer_id,
      reviewText,
      rating,
    });
    console.log(review);
    const teacher = await User.findById(shadow_teacher_id);
    console.log(teacher);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    console.log(teacher);
    teacher.reviews.push(review._id);
    await teacher.save();
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  const { id } = req.params;
  const { shadow_teacher_id, reviewer_id, reviewText, rating } = req.body;
  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { shadow_teacher_id, reviewer_id, reviewText, rating },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the review" });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the review" });
  }
};
