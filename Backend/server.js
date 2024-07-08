const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(cors());

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

  try {
    let user;

    if (mobile && password) {
      user = await User.findOne({ mobile, password });
    } else {
      return res.status(400).send("Invalid parameters");
    }

    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
