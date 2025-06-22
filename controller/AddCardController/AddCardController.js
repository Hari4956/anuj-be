const AddcardModel = require("../../models/AddCardModel/AddCardModel");

const CreateaddCard = async (req, res) => {
    try {
        const { selectedProduct, fullName, phoneNumber, location } = req.body;

        if (!selectedProduct || selectedProduct.length === 0) {
            return res.status(400).json({ message: "Selected product is required." });
        }

        const addCard = new AddcardModel({
            selectedProduct,
            fullName,
            phoneNumber,
            location,
        });

        await addCard.save();
        res.status(201).json(addCard);
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(400).json({ message: error.message });
    }
};

const getAllCards = async (req, res) => {
    try {
        const cards = await AddcardModel.find().populate("selectedProduct.product");
        res.status(200).json(cards);
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).json({ message: error.message });
    }
};

const deleteCardById = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCard = await AddcardModel.findByIdAndDelete(id);
        if (!deletedCard) {
            return res.status(404).json({ message: "Card not found" });
        }
        res.status(200).json({
            message: "Card deleted successfully",
            data: deletedCard
        });
    } catch (error) {
        console.error("Error deleting card:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { CreateaddCard, getAllCards, deleteCardById };