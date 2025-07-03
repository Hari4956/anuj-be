const RequestCallback = require('../../models/formModel/requestCallback');

const createRequestCallback = async (req, res) => {
  try {
    const { fullName, phoneNumber, location } = req.body;

    if (!fullName || !phoneNumber || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: "Invalid phone number format. It must be exactly 10 digits." });
    }


    // Save to DB
    const newRequest = new RequestCallback({ fullName, phoneNumber, location });
    const saved = await newRequest.save();

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getAllRequestCallbacks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({
        success: false,
        error: "Page and limit must be positive numbers"
      });
    }

    const skip = (page - 1) * limit;

    const callbacks = await RequestCallback.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await RequestCallback.countDocuments();
    res.status(200).json({
      success: true,
      data: callbacks,
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


const updateRequestCallbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, phoneNumber, location } = req.body;

    const updated = await RequestCallback.findByIdAndUpdate(
      id,
      { fullName, phoneNumber, location },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "Not found" });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteRequestCallbackById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await RequestCallback.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRequestCallback,
  getAllRequestCallbacks,
  updateRequestCallbackById,
  deleteRequestCallbackById
};



