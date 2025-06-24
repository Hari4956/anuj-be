const RequestCallback = require('../../models/formModel/requestCallback');

const createRequestCallback = async (req, res) => {
  try {
    const { fullName, phoneNumber, location } = req.body;

    // Basic required field validation
    if (!fullName || !phoneNumber || !location) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Phone number validation (Indian format - 10 digits, starts with 6-9)
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
    const callbacks = await RequestCallback.find().sort({ createdAt: -1 });
    res.status(200).json(callbacks);
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



