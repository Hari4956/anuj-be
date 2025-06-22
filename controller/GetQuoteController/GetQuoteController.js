const GetQuote = require("../../models/GetQuoteModel/GetQuoteModel");

const addQuote = async (req, res) => {
    try {
        const { fullName, phoneNumber, location, product, quantity } = req.body;

        console.log(req.body);

        if (!fullName || !phoneNumber || !location || !product || !quantity) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            return res.status(400).json({ error: "Phone number must be 10 digits" });
        }

        const getQuote = new GetQuote({
            fullName,
            phoneNumber,
            location,
            product, // This is just the product ID
            quantity
        });

        await getQuote.save();

        res.status(201).json({
            success: true,
            data: getQuote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getQuotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalQuotes = await GetQuote.countDocuments();

        const quotes = await GetQuote.find()
            .populate('product')
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            data: quotes,
            pagination: {
                totalItems: totalQuotes,
                currentPage: page,
                totalPages: Math.ceil(totalQuotes / limit),
                pageSize: limit
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const deleteQuote = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await GetQuote.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: "Quote not found" });
        }

        res.status(200).json({
            message: "Deleted successfully",
            data: deleted
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        });
    }
};

module.exports = { addQuote, getQuotes, deleteQuote };
