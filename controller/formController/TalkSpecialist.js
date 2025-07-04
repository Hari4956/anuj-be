const Talkmodel = require('../../models/formModel/TalkModel')

const addTalkSpecialist = async (req, res) => {
    try {
        let { fullName, phoneNumber } = req.body;
        console.log(req.body);

        if (!fullName || !phoneNumber) {
            return res.status(400).json({
                success: false,
                error: "All fields are required"
            });
        }

        phoneNumber = String(phoneNumber);

        if (typeof fullName !== 'string' || fullName.trim().length < 3) {
            return res.status(400).json({
                success: false,
                error: "Full Name must be at least 3 characters long"
            });
        }

        const cleanPhone = phoneNumber.replace(/\D/g, "");

        if (!/^\d{10}$/.test(cleanPhone)) {
            return res.status(400).json({
                success: false,
                error: "Phone Number must be exactly 10 digits"
            });
        }

        const newTalk = new Talkmodel({ fullName: fullName.trim(), phoneNumber: cleanPhone });
        const saved = await newTalk.save();

        res.status(201).json({
            success: true,
            data: saved,
            message: "Talk specialist added successfully"
        });

    } catch (error) {
        console.error("Add Talk Specialist Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error"
        });
    }
};

const getAllTalkSpecialist = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { fromDate, toDate } = req.query;

        if (page <= 0 || limit <= 0) {
            return res.status(400).json({
                success: false,
                error: "Page and limit must be positive numbers"
            });
        }

        const skip = (page - 1) * limit;

        const matchStage = {};

        // Date Filter Logic
        if (fromDate || toDate) {
            const dateFilter = {};
            if (fromDate) dateFilter.$gte = new Date(fromDate);
            if (toDate) {
                const to = new Date(toDate);
                to.setHours(23, 59, 59, 999); // Include full day for 'toDate'
                dateFilter.$lte = to;
            }
            matchStage.createdAt = dateFilter;
        }

        // Fetch paginated results
        const talk = await Talkmodel.find(matchStage)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Optional: newest first

        // Total count for frontend
        const total = await Talkmodel.countDocuments(matchStage);

        res.status(200).json({
            success: true,
            data: talk,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Get All Talk Specialist Error:", error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Internal Server Error"
        });
    }
};


const deleteTalkSpecialist = async (req, res) => {
    try {
        const talk = await Talkmodel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            data: talk
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Internal Server Error"
        })
    }
};

module.exports = { addTalkSpecialist, getAllTalkSpecialist, deleteTalkSpecialist };