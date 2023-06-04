import mongoose from "mongoose";
import { Schema, model } from "mongoose";
// import Reviews from "./models/reviewModel";
import validator from "validator";
import mongoosePaginate from "mongoose-paginate-v2";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
      validate: [validator.isEmail, "please enter a valid email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "email is required"],
      validate: [validator.isStrongPassword, "please enter a strong password"],
      select: false,
    },
    first_name: {
      type: String,
      required: function () {
        return this.role === "User" || this.role === "Admin";
      },
    },
    last_name: {
      type: String,
      required: function () {
        return this.role === "User" || this.role === "Admin";
      },
    },
    contact_person_phone: {
      type: String,
      required: function () {
        return this.role === "Teacher";
      },
      validate: [validator.isMobilePhone, "please enter a valid Phone"],
    },
    image: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: function () {
        return this.role === "Teacher";
      },
    },
    city: {
      type: String,
      required: function () {
        return this.role === "Teacher";
      },
    },
    languages: [
      {
        type: String,
        required: function () {
          return this.role === "Teacher";
        },
      },
    ],
    contact_person_email: {
      type: String,
      required: function () {
        return this.role === "Teacher";
      },
      validate: [validator.isEmail, "Please enter a valid email"],
    },
    education: {
      type: String,
      required: function () {
        return this.role === "Teacher";
      },
    },
    description: {
      type: String,
      required: function () {
        return this.role === "Teacher";
      },
    },
    certificates: [
      {
        name: {
          type: String,
          required: true,
        },
        issuingAuthority: {
          type: String,
          required: true,
        },
        issueDate: {
          type: Date,
          required: true,
        },
      },
    ],
    experience: [
      {
        position: {
          type: String,
          required: function () {
            return this.role === "Teacher";
          },
        },
        description: {
          type: String,
          required: function () {
            return this.role === "Teacher";
          },
        },
        company: {
          type: String,
          required: function () {
            return this.role === "Teacher";
          },
        },
        startDate: {
          type: Date,
          required: function () {
            return this.role === "Teacher";
          },
        },
        endDate: {
          type: Date,
          required: function () {
            return this.role === "Teacher";
          },
        },
      },
    ],
    availability: {
      type: String,
      enum: ["full time", "part time", "unavailable"],
      required: function () {
        return this.role === "Teacher";
      },
    },
    previous_cases: [
      {
        type: String,
      },
    ],
    isValid: {
      type: Boolean,
      required: function () {
        return this.role === "Teacher" || this.role === "User";
      },
      default: false,
    },
    role: {
      type: String,
      enum: ["User", "Admin", "Teacher"],
      default: "User",
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    collection: "Users",
    timestamps: true,
  }
);

// UserSchema.pre(["find", "findOne"], function (next) {
//   this.populate("reviews");
//   next();
// });

UserSchema.plugin(mongoosePaginate);
const User = model("User", UserSchema);
export default User;
