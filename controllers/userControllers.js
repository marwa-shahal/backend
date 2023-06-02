import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import Review from "../models/reviewModel.js";
import mongoose from "mongoose";
import express from "express";

// get all users //
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get a single user by ID //
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get a teacher by id //
export const getTeacherById = async (req, res) => {
  const { id } = req.params;
  try {
    const teacher = await User.findById({ _id: id, role: "Teacher" });
    if (!teacher || teacher.role !== "teacher") {
      return res.status(404).json({ message: "Teacher not found" });
    }
    return res.status(200).json(org);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// get a user by id //
export const getNormalUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById({ _id: id, role: "User" }).select(
      "-experience -education -availability -previous_cases -certificates -languages"
    );
    if (!user || user.role !== "User") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// get paginated Teachers //
export const getPaginatedTeachers = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const query = { role: "Teacher" };
    const result = await User.paginate(query, options);

    const { docs, totalDocs, totalPages, hasNextPage, nextPage } = result;

    const adjustedLimit =
      page < totalPages ? options.limit : totalDocs % options.limit;

    const pagination = {
      totalDocs,
      limit: adjustedLimit,
      totalPages,
      page: options.page,
      hasNextPage,
      nextPage: hasNextPage
        ? `${req.baseUrl}/teachers?page=${nextPage}&limit=${limit}`
        : null,
    };

    const populatedDocs = await User.find({ _id: { $in: docs } });

    return res.status(200).json({ teachers: populatedDocs, pagination });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

//get paginated filtered by first_name or last_name

// export const getPaginatedTeachersByName = async (req, res) => {
//   const { page = 1, limit = 5, first_name, last_name } = req.query;

//   try {
//     const options = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sort: { createdAt: -1 },
//     };

//     const query = { role: "Teacher" };

//     if (first_name && last_name) {
//       query.$or = [
//         { first_name: { $regex: new RegExp(first_name, "i") } },
//         { last_name: { $regex: new RegExp(last_name, "i") } },
//       ];
//     } else if (first_name) {
//       query.first_name = { $regex: new RegExp(first_name, "i") };
//     } else if (last_name) {
//       query.last_name = { $regex: new RegExp(last_name, "i") };
//     }

//     const result = await User.paginate(query, options);

//     const { docs, totalDocs, totalPages, hasNextPage, nextPage } = result;

//     const adjustedLimit =
//       page < totalPages ? options.limit : totalDocs % options.limit;

//     const pagination = {
//       totalDocs,
//       limit: adjustedLimit,
//       totalPages,
//       page: options.page,
//       hasNextPage,
//       nextPage: hasNextPage
//         ? `${req.baseUrl}/teachers?page=${nextPage}&limit=${limit}`
//         : null,
//     };

//     const populatedDocs = await User.find({ _id: { $in: docs } });

//     return res.status(200).json({ teachers: populatedDocs, pagination });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: error.message });
//   }
// };

// export const getPaginatedTeachersByName = async (req, res) => {
//   const {
//     page = 1,
//     limit = 4,
//     query: search,
//     country,
//     availability,
//   } = req.query;
//   var query;
//   console.log("query", query);
//   var filter = {};
//   filter.role = 'Teacher';
//   console.log(req.query);
//   try {
//     const options = {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sort: { createdAt: -1 },
//     };
//     if (search) {
//       query = search.split(" ");
//       if (query.length > 0 && query) {
//         if (query.length > 1) {
//           filter = {
//             first_name: { $regex: new RegExp(query[0], "i") },
//             last_name: { $regex: new RegExp(term[1], "i") },
//           };
//         }
//         if (query.length === 1) {
//           filter = {
//             $or: [
//               {
//                 first_name: { $regex: new RegExp(query[0], "i") },
//               },
//               {
//                 last_name: { $regex: new RegExp(query[0], "i") },
//               },
//             ],
//           };
//         }
//       }
//     }

//     if (country) {
//       filter.country = country;
//     }

//     if (availability) {
//       filter.availability = availability;
//     }

//     console.log("filter",filter);
//     const result = await User.paginate(filter, options);

//     const { docs, totalDocs, totalPages, hasNextPage, nextPage } = result;

//     const adjustedLimit =
//       page < totalPages ? options.limit : totalDocs % options.limit;

//     const pagination = {
//       totalDocs,
//       limit: adjustedLimit,
//       totalPages,
//       page: options.page,
//       hasNextPage,
//     };

//     res.status(200).json({ pagination, teachers: docs });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Internal server error", message: error.message });
//   }
// };

export const getFilteredPaginatedTeachers = async (req, res) => {
  const {
    page = 1,
    limit = 4,
    query: search,
    country,
    availability,
  } = req.query;

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const filter = {
      role: "Teacher",
    };

    if (search) {
      const query = search.split(" ");
      if (query.length > 0 && query) {
        if (query.length > 1) {
          filter.$and = [
            {
              first_name: { $regex: new RegExp(query[0], "i") },
            },
            {
              last_name: { $regex: new RegExp(query[1], "i") },
            },
          ];
        }
        if (query.length === 1) {
          filter.$or = [
            {
              first_name: { $regex: new RegExp(query[0], "i") },
            },
            {
              last_name: { $regex: new RegExp(query[0], "i") },
            },
          ];
        }
      }
    }

    if (country) {
      filter.country = country;
    }

    if (availability) {
      filter.availability = availability;
    }

    console.log("filter", filter);
    const result = await User.paginate(filter, options);

    const { docs, totalDocs, totalPages, hasNextPage, nextPage } = result;

    const adjustedLimit =
      page < totalPages ? options.limit : totalDocs % options.limit;

    const pagination = {
      totalDocs,
      limit: adjustedLimit,
      totalPages,
      page: options.page,
      hasNextPage,
    };
    console.log("docs", docs);
    res.status(200).json({ pagination, teachers: docs });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", message: error.message });
  }
};

// get paginated Users //
export const getPaginatedUsers = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;

  try {
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
    };

    const query = { role: "User" };

    const result = await User.paginate(query, options);

    const { docs, totalDocs, totalPages, hasNextPage, nextPage } = result;

    const adjustedLimit =
      page < totalPages ? options.limit : totalDocs % options.limit;

    const pagination = {
      totalDocs,
      limit: adjustedLimit,
      totalPages,
      page: options.page,
      hasNextPage,
      nextPage: hasNextPage
        ? `${req.baseUrl}/users?page=${nextPage}&limit=${limit}`
        : null,
    };

    const populatedDocs = await User.find({ _id: { $in: docs } }).select(
      "-newsResources"
    );

    return res.status(200).json({ users: populatedDocs, pagination });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Create a new user  //
export const createUser = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    contact_person_email,
    contact_person_phone,
    image,
    country,
    city,
    languages,
    education,
    certificates,
    experience,
    description,
    availability,
    previous_cases,
    isValid,
    role,
  } = req.body;
  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }
    console.log(req.body);
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      role,
      isValid,
    });
    //Check if any required field is missing
    if (!first_name || !last_name || !role || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (role === "User" || role === "Admin") {
      country ? (newUser.country = country) : null;
      city ? (newUser.city = city) : null;
      contact_person_email
        ? (newUser.contact_person_email = contact_person_email)
        : null;
      contact_person_phone
        ? (newUser.contact_person_phone = contact_person_phone)
        : null;
      image ? (newUser.image = image) : null;
    } else if (role === "Teacher") {
      newUser.city = city;
      newUser.country = country;
      newUser.contact_person_email = contact_person_email;
      newUser.contact_person_phone = contact_person_phone;
      newUser.image ? (newUser.image = image) : null;
      newUser.languages = languages;
      newUser.education = education;
      newUser.description = description;
      certificates ? (newUser.certificates = certificates) : null;
      experience ? (newUser.experience = experience) : null;
      newUser.availability = availability;
      newUser.reviews = [];
      newUser.availability = "full time";
      previous_cases ? (newUser.previous_cases = previous_cases) : null;
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
    // salt the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(newUser.password, salt);

    newUser.password = hashedPassword;
    await newUser.validate();
    const user = await newUser.save();
    const { password: removedPassword, ...returnUser } = user._doc;
    return res
      .status(201)
      .json({ message: "Registration successful", user: returnUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// login a user //
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    
    return res
      .status(200)
      .json({ message: "Logged in successfully", user: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// Update a user //
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

// Delete a user //
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the user by id
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Delete the user's image file if it exists
    if (user.image) {
      fs.unlink(user.image, (err) => {
        // Ignore any errors during file deletion
        if (err) console.error(err);
      });
    }
    // Delete the user from the database
    await User.findByIdAndDelete(id);
    res.status(204).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
