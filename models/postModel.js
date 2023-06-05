import { Schema, model } from "mongoose";

const PostSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    poster_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    collection: "Posts",
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
