import { Schema, model } from "mongoose";
import User from "./userModel.js";

// Define the schema for the collection
const ReviewSchema = new Schema(
  {
    shadow_teacher_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewer_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "Reviews",
    timestamps: true,
  }
);

// ReviewSchema.pre(["find", "findOne"], function (next) {
//   this.populate({path:"shadow_teacher_id"});
//   next();
// });

const Review = model("Review", ReviewSchema);

export default Review;
