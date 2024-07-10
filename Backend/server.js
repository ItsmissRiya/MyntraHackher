const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const authenticateToken = require("./authenticateToken"); // Adjust the path as necessary
const app = express();
const multer = require("multer");
const path = require("path"); // Add this line to import the path module

app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

const JWT_SECRET =
  "b4b53064bc848d70411f67443ff08ba812c6736d72684bfd666be8837b67a2b3";

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files to uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp + file extension
  },
});
const upload = multer({ storage: storage });

// Connect to MongoDB (replace `<dbname>` with your actual database name)
mongoose.connect(
  "mongodb+srv://0Cd7VgY5LfajBuKZ:0Cd7VgY5LfajBuKZ@cluster0.uxeuqcr.mongodb.net/new",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define Mongoose schema and model (replace with your actual User schema definition)
const User = mongoose.model("User", {
  name: String,
  mobile: String,
  email: String,
  password: String,
});

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle signup form submission
app.post("/signup", async (req, res) => {
  const { name, mobile, email, password } = req.body;
  try {
    const newUser = new User({ name, mobile, email, password });
    await newUser.save();
    res.status(200).send("User registered successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering user");
  }
});

app.post("/login", async (req, res) => {
  const { mobile, password } = req.body; // Read from request body

  console.log("Request body:", req.body); // Log request body

  try {
    let user;

    if (mobile && password) {
      user = await User.findOne({ mobile, password });
      console.log("User found:"); // Log user details if found
      console.log(user.name);
    } else {
      console.error("Invalid parameters");
      return res.status(400).send("Invalid parameters");
    }

    if (user) {
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      // Send token in response
      console.log("Token generated:", token); // Log generated token
      res.status(200).json({ exists: true, token, name: user.name });
    } else {
      console.error("Invalid credentials--from token");
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send("Server error");
  }
});

// Middleware to authenticate JWT token
app.use(authenticateToken);
// Example of `authenticateToken` middleware (not provided in your snippet)

// Protected route example
app.get("/protected", (req, res) => {
  res.json({
    message: "Protected route accessed successfully",
    userId: req.userId,
  });
});

// POST route for posting content with file upload
app.post("/post", upload.single("image"), async (req, res) => {
  const { caption } = req.body;
  const { file } = req;

  if (!file) {
    return res.status(400).json({ error: "Image file is required" });
  }

  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newPost = {
      imageUrl: file.path,
      caption: caption,
      createdAt: new Date(),
    };

    // Ensure user.posts is initialized as an array
    if (!Array.isArray(user.posts)) {
      user.posts = [];
    }

    user.posts.push(newPost);

    await user.save();

    res.status(200).json({ message: "Post submitted successfully" });
  } catch (error) {
    console.error("Error submitting post:", error);
    res.status(500).json({ error: "Error submitting post" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
