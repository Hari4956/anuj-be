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
const ConstructionExpo = require("./routes/formRoute/ConstructionExpoRoute");
const AnujCareers = require("./routes/formRoute/AnujCareersRoutes");
const featureImage = require("./routes/productsDetailsRoute/FeatureImageRouter");
const contactUs = require("./routes/ContactUsRouter/ContactUsRouter");
const Banner = require("./routes/Banner/Banner");
const Awards = require("./routes/AwardsRoutes/AwardRoutes");
const AboutVideo = require("./routes/AboutVideoRouter/AboutVideoRoutes");
const GetQuote = require("./routes/GetQuoteRoutes/GetQuoteRoutes");
const Addcard = require("./routes/AddCardRoutes/AddCardRoutes");
const catalog = require("./routes/formRoute/CatalogRoutes");
const TalkSpecialist = require("./routes/formRoute/TalkSpecialist");
const VideoLibrary = require("./routes/VideoLibraryRouter/VideoLibrary");
const { createDefaultUser } = require("./models/auth/UserModel");
dotenv.config();
const path = require("path");
const fs = require("fs");
const app = express();

// Serve .gz files with proper headers using a custom handler
app.use((req, res, next) => {
  if (req.url.endsWith(".framework.js.gz")) {
    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", "application/javascript");
  } else if (req.url.endsWith(".data.gz")) {
    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", "application/octet-stream");
  } else if (req.url.endsWith(".wasm.gz")) {
    res.set("Content-Encoding", "gzip");
    res.set("Content-Type", "application/wasm");
  }
  next();
});

// Serve static files
app.use(
  "/Bedroom_Build",
  express.static(path.join(__dirname, "builds/Bedroom_Build"))
);
app.use(
  "/Elevation_and_Parking_Build",
  express.static(path.join(__dirname, "builds/Elevation_and_Parking_Build"))
);
app.use(
  "/Kitchen_Build",
  express.static(path.join(__dirname, "builds/Kitchen_Build"))
);
app.use(
  "/Living_Room_Build",
  express.static(path.join(__dirname, "builds/living_room_Build"))
);
app.use(
  "/Restroom_Build",
  express.static(path.join(__dirname, "builds/Restroom_build"))
);
// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://friendly-piroshki-7d3963.netlify.app",
      "https://wondrous-duckanoo-03bdf1.netlify.app",
      "https://lucent-cannoli-b39c8c.netlify.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// User routes
app.use("/api/user", userRouter);
// createDefaultUser();

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
app.use("/api/catalog", catalog);
app.use("/api/talkSpecialist", TalkSpecialist);
app.use("/api/constructionExpo", ConstructionExpo);
app.use("/api/anujCareers", AnujCareers);

//awards
app.use("/api/awards", Awards);

// aboutVideo
app.use("/api/aboutVideo", AboutVideo);

//videoLibrary
app.use("/api/videoLibrary", VideoLibrary);

// getQuote
app.use("/api/getQuote", GetQuote);

// addCard
app.use("/api/addtoCart", Addcard);

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
