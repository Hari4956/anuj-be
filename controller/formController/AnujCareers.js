const Anuj = require("../../models/formModel/AnujCareers");

const createCareers = async (req, res) => {
  try {
    console.log(req.body);

    const { fullName, phoneNumber, email, qualification } = req.body;

    if (!fullName || !phoneNumber || !qualification || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: "Phone number must be 10 digits" });
    }

    const newCareers = new Anuj({
      fullName,
      phoneNumber,
      email,
      qualification,
    });
    const saved = await newCareers.save();
    res.status(201).json({
      message: "Careers registration successful",
      data: saved,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCareers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { fromDate, toDate } = req.query;

    if (page <= 0 || limit <= 0) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive numbers" });
    }

    const skip = (page - 1) * limit;
    const matchStage = {};

    // Date Filter Logic
    if (fromDate || toDate) {
      const dateFilter = {};
      if (fromDate) dateFilter.$gte = new Date(fromDate);
      if (toDate) {
        const to = new Date(toDate);
        to.setHours(23, 59, 59, 999);
        dateFilter.$lte = to;
      }
      matchStage.createdAt = dateFilter;
    }

    const Careers = await Anuj.find(matchStage)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Anuj.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      data: Careers,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createCareers, getAllCareers };
