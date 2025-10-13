import { Video } from "../models/video.model.js";

export async function cretevideo(req, res) {
  try {
    const newVideo = await Video.create({ ...req.body, uploader: req.user});
    if (!newVideo) {
      return res.status(400).json({ message: "Something went wrong" });
    }
    return res.status(201).json({ message: "video created", newVideo });
  } catch (error) {
    res.status(500).json({message:"Internal server error",error:error.message})
  }
}


export async function fetchVideos(req, res) {
  try {
    const allVideos = await Video.find().populate("uploader", "username avatar").populate("channelId", "channelName subscribers").populate("comments", "text userId timestamp");
    if(!allVideos){
      return res.status(400).json({message:"Something went wrong"})
    }
    return res.status(200).json({message:"fetch all video successfully",allVideos})
  } catch (error) {
    return res.status(500).json({message:"Internal server error",error:error.message})
  }
}


export async function updateVideo(req, res) {
  try {
    const videoId = req.params.videoId
    console.log(videoId);
    const updatedVideo = await Video.findByIdAndUpdate(videoId,req.body,{new:true,runValidators:true})
    if(!updatedVideo){
      return res.status(404).json({message:"Vedio not found"})
    }
    return res.status(200).json({message:"video updated successfully",updatedVideo})
  } catch (error) {
    return res.status(500).json({message:"Internal server error",error:error.message})
  }
}


export async function deleteVedio(req, res) {
  try {
    const videoId  = req.params.videoId
    const deletedVedio = await Video.findByIdAndDelete(videoId)
    if(!deleteVedio){
      return res.status(404).json({message:"Vodeo not found"})
    }
    return res.status(200).json({message:"vedio deleted successfully",deletedVedio})
  } catch (error) {
      return res.status(500).json({message:"Internal server error",error:error.message})
  }
}