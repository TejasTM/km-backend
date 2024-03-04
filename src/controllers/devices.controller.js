const Device = require("../models/devices.model");
const axios =require("axios")
// exports.getDevices = async (req, res) => {
//   try {
//     console.log("Check");
//     const devices = await Device.find();
//     if (devices) {
//       res.status(200).send({
//         succes: true,
//         data: devices,
//       });
//     }
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };
exports.getDevices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; 
    const searchTerm = req.query.searchTerm || ''; // Get the search term from query parameters

    // Calculate the skip value based on the page and limit
    const skip = (page - 1) * limit;

    // Build the query object for search
    const query = {};

    // If searchTerm is provided, add search condition to the query
    if (searchTerm) {
      query.$or = [
        { brand: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search on brand
        { model: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search on model
        { category: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search on category
        { description: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search on description
      ];
    }

    // Execute two queries in parallel to fetch devices and count total devices
    const [devices, totalDevices] = await Promise.all([
      Device.find(query).skip(skip).limit(limit), // Query to fetch devices with pagination and search
      Device.countDocuments(query), // Query to count total devices with search
    ]);

    res.status(200).send({
      success: true,
      data: devices,
      total: totalDevices,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.addDevices = async (req, res) => {
  try {
    // Create a new post
    const newPost = await Device.create(req.body);

    if (newPost) {
      // Fetch the updated posts array after adding the new post
      const updatedPosts = await Device.find();

      if (updatedPosts) {
        res.status(201).json({
          success: true,
          data: updatedPosts,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteDevices = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: "Post id missing",
      });
    }
    const deletedPost = await Device.findByIdAndDelete(id);
    if (deletedPost) {
      // Fetch the updated posts array after deletig the post
      const updatedPosts = await Device.find();

      if (updatedPosts) {
        res.status(201).json({
          success: true,
          data: updatedPosts,
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
