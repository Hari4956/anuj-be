const AwardsModel = require("../../models/AwardsModel/AwardsModel");

const AddAwards = async (req, res) => {
    try {
        const { title, year } = req.body;
        const awardsImage = req.file ? req.file.path : null;
        if (!awardsImage || !title || !year) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newAwards = new AwardsModel({ awardsImage, title, year });
        await newAwards.save();
        res.status(200).json({
            message: "Awards added successfully",
            data: newAwards
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllAwards = async (req, res) => {
    try {
        const awards = await AwardsModel.find();
        res.status(200).json({
            success: true,
            data: awards
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const getAwardsById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "id is required"
            });
        }
        const awards = await AwardsModel.findById(id);
        res.status(200).json({
            success: true,
            data: awards
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const updateAwards = async (req, res) => {
    const { id } = req.params;
    try {
        const awards = await AwardsModel.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json({
            success: true,
            data: awards
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const deleteAwards = async (req, res) => {
    const { id } = req.params;
    try {
        const awards = await AwardsModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            data: awards
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

module.exports = { AddAwards, getAllAwards, getAwardsById, deleteAwards, updateAwards };