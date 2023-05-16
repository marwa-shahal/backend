import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import express from "express";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
};

// Get a single user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to get the user" });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  const { first_name, last_name, role, email, password, phone_number } =
    req.body;
  try {
    // Check if any required field is missing
    if (
      !first_name ||
      !last_name ||
      !role ||
      !email ||
      !password ||
      !phone_number
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if the email is valid
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if the password is strong enough
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one number",
      });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      first_name,
      last_name,
      role,
      email,
      password: hashedPassword,
      phone_number,
    });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create the user" });
  }
};

//login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, "your-secret-key");

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to authenticate user" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, role, email, password, phone_number } =
    req.body;
  try {
    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash the password if it's being updated
    let hashedPassword = user.password;
    if (password) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
    }

    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        first_name: first_name || user.first_name,
        last_name: last_name || user.last_name,
        role: role || user.role,
        email: email || user.email,
        password: hashedPassword,
        phone_number: phone_number || user.phone_number,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update the user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).json({message: "User deleted successfully"});
  } catch (error) {
    res.status(500).json({ error: "Failed to delete the user" });
  }
};
