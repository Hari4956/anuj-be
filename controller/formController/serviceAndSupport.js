const ServiceAndSupport = require("../../models/formModel/serviceAndSupport");

const createSupportRequest = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, issue } = req.body;
    const voiceRecord = req.file ? req.file.path : null;

    console.log("Voice Record Cloudinary URL:", voiceRecord);

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|in)$/i;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Phone number regex validation (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ success: false, message: "Invalid phone number. Must be 10 digits." });
    }

    const newRequest = new ServiceAndSupport({
      fullName,
      phoneNumber,
      email,
      issue,
      voiceRecord
    });

    const savedRequest = await newRequest.save();

    res.status(201).json({
      success: true,
      message: "Support request submitted",
      data: savedRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit request",
      error: error.message
    });
  }
};

const getAllSupportRequests = async (req, res) => {
  try {
    const requests = await ServiceAndSupport.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
};

const deleteSupportRequest = async (req, res) => {
  try {
    const deleted = await ServiceAndSupport.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Request not found" });

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete", details: error.message });
  }
};

const updateSupportRequest = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, issue } = req.body;
    const updateData = {};

    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.(com|net|org|in)$/i;
    if (email) {
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      updateData.email = email;
    }

    // Phone number validation (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (phoneNumber) {
      if (!phoneRegex.test(phoneNumber)) {
        return res
          .status(400)
          .json({ error: "Invalid phone number. Must be 10 digits." });
      }
      updateData.phoneNumber = phoneNumber;
    }

    if (fullName) updateData.fullName = fullName;
    if (issue) updateData.issue = issue;

    // Handle voice record update
    if (req.file) {
      updateData.voiceRecord = req.file.path;
    }

    const updated = await ServiceAndSupport.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updated) return res.status(404).json({ error: "Request not found" });

    res.status(200).json({ message: "Updated successfully", data: updated });
  } catch (error) {
    res.status(500).json({ error: "Failed to update", details: error.message });
  }
};

module.exports = {
  createSupportRequest,
  getAllSupportRequests,
  deleteSupportRequest,
  updateSupportRequest,
};
