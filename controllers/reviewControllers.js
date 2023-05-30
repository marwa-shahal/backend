import Review from "../models/reviewModel.js";

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to get reviews" });
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
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the review" });
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
