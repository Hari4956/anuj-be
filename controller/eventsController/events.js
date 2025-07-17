const EventPage = require("../../models/eventsModel/events");

const createEvent = async (req, res) => {
  console.log(req.body);
  console.log(req.body.filterEvent);
  try {
    const bodyFields = {};
    Object.keys(req.body).forEach((key) => {
      bodyFields[key.trim()] = req.body[key];
    });

    const {
      mainHeading,
      place,
      para,
      date,
      filterEvent,
      tableOfContent,
      subContents,
    } = bodyFields;

    if (!mainHeading || !place || !para || !date) {
      return res.status(400).json({
        success: false,
        error: "All main fields are required.",
      });
    }

    const allowedFilterEvents = ["Feature Events", "Upcoming Events"];

    if (filterEvent && !allowedFilterEvents.includes(filterEvent.trim())) {
      return res.status(400).json({
        success: false,
        error: `filterEvent must be one of: ${allowedFilterEvents.join(", ")}`,
      });
    }

    let parsedTableOfContent = [];
    if (tableOfContent) {
      parsedTableOfContent =
        typeof tableOfContent === "string"
          ? JSON.parse(tableOfContent)
          : tableOfContent;
      if (!Array.isArray(parsedTableOfContent)) {
        return res
          .status(400)
          .json({ success: false, error: "tableOfContent must be an array" });
      }
    }

    // Parse subContents
    let processedSubContents = [];
    if (subContents) {
      const parsedSubContents =
        typeof subContents === "string" ? JSON.parse(subContents) : subContents;

      if (!Array.isArray(parsedSubContents)) {
        return res
          .status(400)
          .json({ success: false, error: "subContents must be an array" });
      }

      // Prepare subImages mapping
      const subImagesMap = {}; // { '0': [img1, img2], '1': [img3] }
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          const match = file.fieldname.match(
            /subContents\[(\d+)]\[subImages]\[(\d+)]/
          );
          if (match) {
            const subIndex = match[1];
            if (!subImagesMap[subIndex]) subImagesMap[subIndex] = [];
            subImagesMap[subIndex].push(file.path); // Cloudinary URL
          }
        });
      }

      // Build final subContents
      processedSubContents = parsedSubContents.map((subContent, index) => {
        if (!subContent.pictureHeading || !subContent.pictureDescription) {
          throw new Error(
            "Each subContent must have pictureHeading and pictureDescription"
          );
        }
        return {
          pictureHeading: subContent.pictureHeading,
          pictureDescription: subContent.pictureDescription,
          subImages: subImagesMap[index] || [],
        };
      });
    }

    // Create and save Event
    const newEvent = new EventPage({
      mainHeading,
      place,
      para,
      date,
      filterEvent: filterEvent?.trim(),
      tableOfContent: parsedTableOfContent,
      subContents: processedSubContents,
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: newEvent,
    });
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

const getByEventId = async (req, res) => {
  try {
    const EventId = req.params.id;
    const events = await EventPage.findById(EventId);

    if (!events) {
      return res.status(404).json({
        success: false,
        message: "events not found",
      });
    }
    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.log("error in get events", error);
    res.status(500).json({
      success: false,
      message: "internal server error",
      details: error.message,
    });
  }
};

// const getAllEvent = async (req, res) => {
//   try {
//     const { fromDate, toDate, filterEvent } = req.query;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 6;
//     const skip = (page - 1) * limit;

//     if (page <= 0 || limit <= 0) {
//       return res.status(400).json({
//         success: false,
//         error: "Page and limit must be positive numbers",
//       });
//     }

//     const from = fromDate ? new Date(fromDate) : null;
//     const to = toDate ? new Date(toDate) : null;

//     const matchStage = {};

//     // Date range filter
//     if (from || to) {
//       const dateFilter = {};
//       if (from) dateFilter.$gte = from;
//       if (to) {
//         to.setHours(23, 59, 59, 999);
//         dateFilter.$lte = to;
//       }
//       matchStage.createdAt = dateFilter;
//     }

//     const normalizedFilter = filterEvent;

//     if (normalizedFilter) {
//       if (normalizedFilter === "past events") {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Midnight today
//         matchStage.date = { $lt: today }; // ✅ event date is before today
//       } else {
//         matchStage.filterEvent = {
//           $regex: `^${filterEvent.trim()}$`,
//           $options: "i",
//         };
//       }
//     }

//     const filterStage = Object.keys(matchStage).length
//       ? [{ $match: matchStage }]
//       : [];

//     const totalEvents = await EventPage.countDocuments(matchStage);

//     const events = await EventPage.aggregate([
//       ...filterStage,
//       { $sort: { createdAt: -1 } },
//       { $skip: skip },
//       { $limit: limit },
//     ]);

//     // Custom message for "Past Events"
//     if (events.length === 0 && normalizedFilter === "past events") {
//       return res.status(200).json({
//         success: true,
//         data: [],
//         message: "No past events available.",
//         pagination: {
//           totalItems: 0,
//           currentPage: page,
//           totalPages: 0,
//           pageSize: limit,
//         },
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: events,
//       pagination: {
//         totalItems: totalEvents,
//         currentPage: page,
//         totalPages: Math.ceil(totalEvents / limit),
//         pageSize: limit,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//       details: error.message,
//     });
//   }
// };

const getAllEvent = async (req, res) => {
  try {
    const { fromDate, toDate, filterEvent = "", search = "" } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    if (page <= 0 || limit <= 0) {
      return res.status(400).json({
        success: false,
        error: "Page and limit must be positive numbers",
      });
    }

    const matchStage = {};

    // ✅ Handle createdAt: fromDate, toDate, and "past events"
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Normalize filter name
    const normalizedFilter = filterEvent.toLowerCase().trim();

    let createdAtFilter = {};

    if (normalizedFilter === "past events") {
      createdAtFilter.$lt = today;
    }

    if (fromDate) {
      const from = new Date(fromDate);
      createdAtFilter.$gte = from;
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      createdAtFilter.$lte = to;
    }

    if (Object.keys(createdAtFilter).length) {
      matchStage.createdAt = createdAtFilter;
    }

    // ✅ Filter by event type
    if (normalizedFilter && normalizedFilter !== "past events") {
      matchStage.filterEvent = {
        $regex: `^${normalizedFilter}$`,
        $options: "i",
      };
    }

    // ✅ Search
    if (search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");
      matchStage.$or = [
        { mainHeading: searchRegex },
        // Add more fields if needed
      ];
    }

    // Final filtering stage
    const filterStage = Object.keys(matchStage).length
      ? [{ $match: matchStage }]
      : [];

    // Count and aggregate
    const totalEvents = await EventPage.countDocuments(matchStage);

    const events = await EventPage.aggregate([
      ...filterStage,
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]);

    // Response
    res.status(200).json({
      success: true,
      data: events,
      message: events.length ? undefined : "No events found.",
      pagination: {
        totalItems: totalEvents,
        currentPage: page,
        totalPages: Math.ceil(totalEvents / limit),
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      details: error.message,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await EventPage.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Delete the event
    await EventPage.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Full error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  let {
    mainHeading,
    place,
    para,
    date,
    filterEvent,
    tableOfContent,
    subContents,
  } = req.body;

  try {
    const existingEvent = await EventPage.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Parse JSON strings if needed
    if (typeof subContents === "string") subContents = JSON.parse(subContents);
    if (typeof tableOfContent === "string")
      tableOfContent = JSON.parse(tableOfContent);

    // Update subContents and handle image replacement
    const updatedSubContents = subContents.map((sub, index) => {
      const existingSub = existingEvent.subContents[index] || {};
      const uploadedImages = (req.files || [])
        .filter((file) => file.fieldname === `subImages_${index}`)
        .map((file) => file.path);

      return {
        ...existingSub,
        ...sub,
        subImages:
          uploadedImages.length > 0
            ? uploadedImages
            : existingSub.subImages || [],
      };
    });

    // Update text fields
    existingEvent.mainHeading = mainHeading || existingEvent.mainHeading;
    existingEvent.place = place || existingEvent.place;
    existingEvent.filterEvent = filterEvent || existingEvent.filterEvent;
    existingEvent.para = para || existingEvent.para;
    existingEvent.date = date || existingEvent.date;
    existingEvent.tableOfContent =
      tableOfContent || existingEvent.tableOfContent;
    existingEvent.subContents = updatedSubContents;

    // Replace main image if uploaded
    const mainImgFile = (req.files || []).find(
      (f) => f.fieldname === "mainImage"
    );
    if (mainImgFile) {
      existingEvent.mainImage = mainImgFile.path;
    }

    const updatedEvent = await existingEvent.save();

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createEvent,
  getByEventId,
  getAllEvent,
  deleteEvent,
  updateEvent,
};
