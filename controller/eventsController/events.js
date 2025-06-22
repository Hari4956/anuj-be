const EventPage = require("../../models/eventsModel/events");

const createEvent = async (req, res) => {
  try {
    // Trim whitespace from field names
    const bodyFields = {};
    Object.keys(req.body).forEach((key) => {
      bodyFields[key.trim()] = req.body[key];
    });

    const {
      mainHeading,
      place,
      para,
      date,
      event,
      tableOfContent,
      subContents,
    } = bodyFields;

    console.log("Received body fields:", bodyFields);

    // Handle mainImage
    const mainImage = req.files?.mainImage?.[0]?.path || null;

    // Handle subImages
    const subImages = req.files?.subImages?.map((file) => file.path) || [];

    // Validate required fields
    if (!mainHeading || !mainImage || !place || !para || !date || !event) {
      return res.status(400).json({
        success: false,
        error: "All main fields are required.",
      });
    }

    // Process tableOfContent safely
    let parsedTableOfContent = [];
    if (tableOfContent) {
      try {
        parsedTableOfContent =
          typeof tableOfContent === "string"
            ? JSON.parse(tableOfContent)
            : tableOfContent;

        if (!Array.isArray(parsedTableOfContent)) {
          return res.status(400).json({
            success: false,
            error: "tableOfContent must be an array",
          });
        }
      } catch (e) {
        console.error("Error parsing tableOfContent:", e);
        return res.status(400).json({
          success: false,
          error: "Invalid tableOfContent format",
        });
      }
    }

    // Process subContents safely with exactly 3 fields
    let processedSubContents = [];
    if (subContents) {
      try {
        const parsedSubContents =
          typeof subContents === "string"
            ? JSON.parse(subContents)
            : subContents;

        if (Array.isArray(parsedSubContents)) {
          // Validate each subContent has exactly the required 3 fields
          processedSubContents = parsedSubContents.map((subContent, index) => {
            if (!subContent.pictureHeading || !subContent.pictureDescription) {
              throw new Error(
                "Each subContent must have pictureHeading and pictureDescription"
              );
            }

            return {
              pictureHeading: subContent.pictureHeading,
              pictureDescription: subContent.pictureDescription,
              subImages: subImages[index] ? [subImages[index]] : [],
            };
          });
        } else {
          return res.status(400).json({
            success: false,
            error: "subContents must be an array",
          });
        }
      } catch (e) {
        console.error("Error parsing subContents:", e);
        return res.status(400).json({
          success: false,
          error: e.message || "Invalid subContents format",
        });
      }
    }

    // Validate that if there are subImages, there must be matching subContents
    if (
      subImages.length > 0 &&
      processedSubContents.length !== subImages.length
    ) {
      return res.status(400).json({
        success: false,
        error: "Number of subImages must match number of subContents",
      });
    }

    // Create and save the new event
    const newEvent = new EventPage({
      mainHeading,
      mainImage,
      place,
      para,
      date,
      event,
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
      validationErrors: error.errors,
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
    res.status.json({
      success: false,
      message: "internal server error",
      details: error.message,
    });
  }
};

const getAllEvent = async (req, res) => {
  try {
    const event = await EventPage.find();
    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
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
  try {
    const { id } = req.params;
    console.log("Updating event with ID:", id);
    if (!req.body) {
      return res.status(400).json({
        success: false,
        error: "Request body is missing.",
      });
    }

    // Trim all field names in the request body
    const bodyFields = {};
    Object.keys(req.body).forEach((key) => {
      bodyFields[key.trim()] = req.body[key];
    });

    const {
      mainHeading,
      place,
      para,
      date,
      event,
      tableOfContent,
      subContents,
    } = bodyFields;

    const mainImage = req.files?.mainImage?.[0]?.path || null;
    const subImages = req.files?.subImages?.map((file) => file.path) || [];

    // Check if the event exists
    const existingEvent = await EventPage.findById(id);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        error: "Event not found.",
      });
    }

    // Update main fields if provided
    if (mainHeading !== undefined) existingEvent.mainHeading = mainHeading;
    if (place !== undefined) existingEvent.place = place;
    if (para !== undefined) existingEvent.para = para;
    if (date !== undefined) existingEvent.date = date;
    if (event !== undefined) existingEvent.event = event;
    if (mainImage) existingEvent.mainImage = mainImage;

    let parsedTableOfContent = existingEvent.tableOfContent || [];
    if (tableOfContent !== undefined) {
      try {
        parsedTableOfContent =
          typeof tableOfContent === "string"
            ? JSON.parse(tableOfContent)
            : tableOfContent;

        if (!Array.isArray(parsedTableOfContent)) {
          return res.status(400).json({
            success: false,
            error: "tableOfContent must be an array",
          });
        }

        existingEvent.tableOfContent = parsedTableOfContent;
      } catch (e) {
        console.error("Error parsing tableOfContent:", e);
        return res.status(400).json({
          success: false,
          error: "Invalid tableOfContent format.",
        });
      }
    }

    // Process subContents
    if (subContents !== undefined) {
      try {
        const parsedSubContents =
          typeof subContents === "string"
            ? JSON.parse(subContents)
            : subContents;

        if (!Array.isArray(parsedSubContents)) {
          return res.status(400).json({
            success: false,
            error: "subContents must be an array",
          });
        }

        if (parsedTableOfContent.length !== parsedSubContents.length) {
          return res.status(400).json({
            success: false,
            error: `Number of subContents (${parsedSubContents.length}) must match number of tableOfContent (${parsedTableOfContent.length}).`,
          });
        }

        const updatedSubContents = [];

        parsedSubContents.forEach((subContent, index) => {
          const subContentImages = subImages[index]
            ? [subImages[index]]
            : subContent.subImages || [];

          if (!subContent.pictureHeading || !subContent.pictureDescription) {
            throw new Error(
              "Each subContent must have pictureHeading and pictureDescription"
            );
          }

          if (subContent._id) {
            const existingSub = existingEvent.subContents.find(
              (sc) => sc._id.toString() === subContent._id
            );

            if (existingSub) {
              updatedSubContents.push({
                ...existingSub.toObject(),
                pictureHeading: subContent.pictureHeading,
                pictureDescription: subContent.pictureDescription,
                subImages: subContentImages.length
                  ? subContentImages
                  : existingSub.subImages,
              });
            }
          } else {
            updatedSubContents.push({
              pictureHeading: subContent.pictureHeading,
              pictureDescription: subContent.pictureDescription,
              subImages: subContentImages,
            });
          }
        });

        existingEvent.subContents = updatedSubContents;
      } catch (e) {
        console.error("Error parsing subContents:", e);
        return res.status(400).json({
          success: false,
          error: e.message || "Invalid subContents format.",
        });
      }
    }

    // Save the updated event
    const updatedEvent = await existingEvent.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Full error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      details: error.message,
    });
  }
};

module.exports = {
  createEvent,
  getByEventId,
  getAllEvent,
  deleteEvent,
  updateEvent,
};
