import { Schema, model } from "mongoose";

// Define the schema for the collection
const ReviewSchema = new Schema({
  shadow_teacher_id: {
    type: Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  reviewer_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
});

ReviewSchema.pre(["find", "findOne"], function (next) {
  this.populate("shadow_teacher_id");
  next();
});

ReviewSchema.pre(["find", "findOne"], function (next) {
  this.populate("reviewer_id");
  next();
});

const Review = model("Review", ReviewSchema);

export default Review;
