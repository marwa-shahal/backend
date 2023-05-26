import { Schema, model } from "mongoose";

const teacherSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  certificates: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  availability: [
    {
      type: String,
      required: true,
    },
  ],
  profile_picture: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  languages: [
    {
      type: String,
      required: true,
    },
  ],
  previous_cases: [
    {
      type: String,
      required: true,
    },
  ],
  education: {
    type: String,
    required: true,
  },
});

const Teacher = model("Teacher", teacherSchema);
export default Teacher;
