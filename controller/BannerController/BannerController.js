const BannerModel = require("../../models/Banner/Banner");

const addBanner = async (req, res) => {
    try {
        const { page, redirectURL } = req.body;   // ✅ Fix casing
        console.log(req.body);
        console.log(req.file);

        if (!req.file || !page || !redirectURL) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const banner = await BannerModel.create({
            page,
            redirectURL,                          // ✅ Consistent naming
            bannerImage: req.file.path || req.file.filename
        });

        res.status(200).json({
            success: true,
            message: "Banner Added Successfully",
            data: banner
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Internal Server Error",
            details: error.message
        });
    }
};

const getBanner = async (req, res) => {
    try {
        const { page } = req.query;

        const filter = {};
        if (page) {
            filter.page = page;
        }

        const banner = await BannerModel.find(filter);

        res.status(200).json({
            success: true,
            data: banner,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Internal Server Error",
            details: error.message,
        });
    }
};

const UpdateBanner = async (req, res) => {
    try {
        const { id, page, redirectURL } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required" });
        }

        const updatedBanner = await BannerModel.findByIdAndUpdate(
            id,
            {
                bannerImage: req.file?.path || req.body.bannerImage, // depends on upload logic
                page,
                redirectURL
            },
            { new: true }
        );

        res.status(200).json({ success: true, data: updatedBanner });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error", details: error.message });
    }
};

const deletebanner = async (req, res) => {
    try {
        const banner = await BannerModel.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "Banner Deleted Successfully",
            data: banner,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Internal Server Error",
            details: error.message,
        });
    }
};

module.exports = { addBanner, getBanner, UpdateBanner, deletebanner };