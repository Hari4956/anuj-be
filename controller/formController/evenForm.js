const Event = require("../../models/formModel/eventForm");

const createEvent = async (req, res) => {
  try {
    const { fullName, phoneNumber, email } = req.body;


    if (!fullName || !phoneNumber || !email) {
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

    const newEvent = new Event({ fullName, phoneNumber, email });
    const saved = await newEvent.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { fromDate, toDate } = req.query;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({ error: "Page and limit must be positive numbers" });
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

    const events = await Event.find(matchStage)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(matchStage);

    res.status(200).json({
      success: true,
      data: events,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body

    if (!body || !body.fullName || !body.phoneNumber || !body.email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const updated = await Event.findByIdAndUpdate(
      id,
      {
        fullName: body.fullName,
        phoneNumber: body.phoneNumber,
        email: body.email
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  updateEventById,
  deleteEventById
};
