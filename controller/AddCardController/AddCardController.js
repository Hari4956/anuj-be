const AddcardModel = require("../../models/AddCardModel/AddCardModel");

const CreateaddCard = async (req, res) => {
    try {
        const { selectedProduct, fullName, phoneNumber, location, price } = req.body;
        console.log(req.body);

        if (!selectedProduct || selectedProduct.length === 0) {
            return res.status(400).json({ message: "Selected product is required." });
        }
        if (!fullName || !phoneNumber || !location || !price) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const addCard = new AddcardModel({
            selectedProduct,
            fullName,
            phoneNumber,
            location,
            price
        });

        await addCard.save();
        await addCard.populate("selectedProduct.product");

        res.status(201).json({
            message: "Card created successfully.",
            data: addCard
        });
    } catch (error) {
        console.error("Error creating card:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getAllCards = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const minPrice = parseFloat(req.query.minPrice);
        const maxPrice = parseFloat(req.query.maxPrice);

        if (page <= 0 || limit <= 0) {
            return res.status(400).json({ message: "Page and limit must be positive numbers" });
        }

        // Build filter
        const filter = {};
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            filter.price = { $gte: minPrice, $lte: maxPrice };
        } else if (!isNaN(minPrice)) {
            filter.price = { $gte: minPrice };
        } else if (!isNaN(maxPrice)) {
            filter.price = { $lte: maxPrice };
        }

        const totalCards = await AddcardModel.countDocuments(filter);

        const cards = await AddcardModel.find(filter)
            .populate("selectedProduct.product")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: cards,
            pagination: {
                totalItems: totalCards,
                currentPage: page,
                totalPages: Math.ceil(totalCards / limit),
                pageSize: limit
            }
        });
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).json({ message: error.message });
    }
};

const getCardsByDate = async (req, res) => {
    try {
        const { fromDate, toDate } = req.query;

        const matchStage = {};

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

        const quotes = await AddcardModel.find(matchStage)
            .populate('selectedProduct.product')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: quotes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
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

module.exports = { CreateaddCard, getAllCards, deleteCardById, getCardsByDate };