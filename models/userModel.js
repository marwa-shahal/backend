import mongoose from "mongoose";
import { Schema, model } from "mongoose";
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
    certificates: [
      {
        name: {
          type: String,
          required: function () {
            return this.role === "Teacher";
          },
        },
        // startDate: {
        //   type: Date,
        //   required: function () {
        //     return this.role === "Teacher";
        //   },
        // },
        // endDate: {
        //   type: Date,
        //   required: function () {
        //     return this.role === "Teacher";
        //   },
        // },
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
    availability: [
      {
        type: String,
        enum: ["full_time", "part_time", "not_available"],
        required: function () {
          return this.role === "Teacher";
        },
      },
    ],
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
  },
  {
    collection: "Users",
    timestamps: true,
  }
);

UserSchema.plugin(mongoosePaginate);
const User = model("User", UserSchema);
export default User;
