import Teacher from "../models/teacherModel.js";

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: "Failed to get teachers" });
  }
};

// Get a single teacher by ID
export const getTeacherById = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Failed to get the teacher" });
  }
};

// Create a new teacher
export const createTeacher = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    certificates,
    experience,
    availability,
    profile_picture,
    location,
    languages,
    previous_cases,
    education,
  } = req.body;
  try {
    const teacher = await Teacher.create({
      first_name,
      last_name,
      email,
      password,
      certificates,
      experience,
      availability,
      profile_picture,
      location,
      languages,
      previous_cases,
      education,
    });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Failed to create the teacher" });
  }
};

// Update a teacher
export const updateTeacher = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    email,
    password,
    certificates,
    experience,
    availability,
    profile_picture,
    location,
    languages,
    previous_cases,
    education,
  } = req.body;
  try {
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      {
        first_name,
        last_name,
        email,
        password,
        certificates,
        experience,
        availability,
        profile_picture,
        location,
        languages,
        previous_cases,
        education,
      },
      { new: true }
    );
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the teacher" });
  }
};

// Delete a teacher
export const deleteTeacher = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await Teacher.findByIdAndDelete(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the teacher" });
  }
};
