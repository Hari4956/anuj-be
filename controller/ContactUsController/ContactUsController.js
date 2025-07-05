const ContactUs = require("../../models/ContactUsModel/ContactUsModel");

const addContactUs = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const formData = Object.assign({}, req.body);
    const { shopName, location, phoneNumber, openUtils, email } = formData;

    const shopImageFile = req.files.find((file) => file.fieldname === 'shopImage');
    const shopImage = shopImageFile ? shopImageFile.path : null;

    if (!shopImage || !shopName || !location || !phoneNumber || !openUtils || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newContactUs = new ContactUs({
      shopImage,
      shopName,
      location,
      phoneNumber,
      openUtils,
      email,
    });

    await newContactUs.save();

    res.status(201).json({
      success: true,
      message: "Contact Us added successfully",
      data: newContactUs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};


const getAllContactUs = async (req, res) => {
  try {
    const contactUs = await ContactUs.find();
    res.status(200).json({
      success: true,
      data: contactUs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

const getContactUsById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }
    const contactUs = await ContactUs.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: contactUs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

const UpdateContactUs = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }
    const contactUs = await ContactUs.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      data: contactUs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

const DeleteContactUs = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "id is required",
      });
    }
    const contactUs = await ContactUs.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      data: contactUs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

module.exports = {
  addContactUs,
  getAllContactUs,
  getContactUsById,
  UpdateContactUs,
  DeleteContactUs,
};
