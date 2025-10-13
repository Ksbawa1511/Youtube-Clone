import { Comment } from "../models/comment.model.js";

export async function fetchComment(req, res) {
  try {
    const allComments = await Comment.find().populate(
      "user",
      "username avatar email"
    );
    if (!allComments) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    return res
      .status(200)
      .json({ message: "Fetch all comments ", allComments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
export async function fetchCommentByVideoId(req, res) {
  try {
    const videoId = req.params.videoId;
    const allComments = await Comment.find({ videoId }).populate(
      "user",
      "username avatar email channels"
    );
    if (!allComments) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    return res
      .status(200)
      .json({ message: "Fetch all comments ", allComments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export async function createComment(req, res) {
  try {
    const newComment = await await Comment.create({
      ...req.body,
      user: req.user,
    });
    if (!newComment) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    return res
      .status(200)
      .json({ message: "comment created successfully", newComment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export async function updateComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      req.body,
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.status(201).json({ message: "comment updated", updatedComment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}

export async function deleteComment(req, res) {
  try {
    const commentId = req.params.commentId;
    const deletedComment = await Comment.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res
      .status(200)
      .json({ message: "comment deleted successfully", deletedComment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
}
