const Post = require("../models/post.model");

exports.getPosts = async (req, res) => {
  try {
    console.log("Check");
    const posts = await Post.find();
    if (posts) {
      res.status(200).send({
        succes: true,
        data: posts,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.addPost = async (req, res) => {
  try {
    // Create a new post
    const newPost = await Post.create(req.body);

    if (newPost) {
      // Fetch the updated posts array after adding the new post
      const updatedPosts = await Post.find();

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

exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({
        success: false,
        error: "Post id missing",
      });
    }
    const deletedPost = await Post.findByIdAndDelete(id);
    if (deletedPost) {
      // Fetch the updated posts array after deletig the post
      const updatedPosts = await Post.find();

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
