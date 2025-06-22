require("dotenv").config();
const multer = require("multer");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/Auth/UserRouter");
const tilesDetails = require("./routes/productsDetailsRoute/productsDetails");
const blog = require("./routes/blogsRoutes/BlogRoutes");
const event = require("./routes/eventsRoute/events");
const designrecommendation = require("./routes/designRecommendationRoute/DesignRecommendation");
const requestCallback = require("./routes/formRoute/requestCallback");
const eventForm = require("./routes/formRoute/eventForm");
const serviceAndSupport = require("./routes/formRoute/serviceAndSupport");
const featureImage = require("./routes/productsDetailsRoute/FeatureImageRouter");
const contactUs = require("./routes/ContactUsRouter/ContactUsRouter");
const Banner = require("./routes/Banner/Banner");
const Awards = require("./routes/AwardsRoutes/AwardRoutes");
const { createDefaultUser } = require("./models/auth/UserModel");
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// User routes
app.use("/api/user", userRouter);

// tileDetails
app.use("/api/tileDetails", tilesDetails);

// featureImage
app.use("/api/featureImage", featureImage);

// blogs
app.use("/api/blog", blog);

// event
app.use("/api/event", event);

//contactUs 
app.use("/api/contactUs", contactUs);

// designRecommendation
app.use("/api/designrecommendation", designrecommendation);

// banner
app.use("/api/banner", Banner);

// forms
app.use("/api/requestCallback", requestCallback);
app.use("/api/eventform", eventForm);
app.use("/api/serviceAndSupportForm", serviceAndSupport);

//awards
app.use("/api/awards", Awards);

// MongoDB connection setup
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    // await createDefaultUser();
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  // Handle multer errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: "File upload error",
      error: err.message,
    });
  }

  // Handle other errors
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {},
  });
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
