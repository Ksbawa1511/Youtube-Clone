import { Channel } from "../models/channel.model.js";

export async function getChannels(req, res) {
  try {
    const channels = await Channel.find().populate("videos", "title thumbnailUrl views uploadDate");
    res.status(200).json({message:"Fetch all channels",channels});
  } catch (error) {
    res.status(500).json({ message: "Error fetching channels",error:error.message });
  }
}

export async function getChannelById(req, res) {
  try {
    const channelId = req.params.channelId;
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }
    res.status(200).json({massage:"Fetch channel",channel});
  } catch (error) {
    res.status(500).json({ message: "Error fetching channel" });
  }
}

export async function createChannel(req, res) {
  try {
    const existingChannel = await Channel.findOne({
      channelName: req.body.channelName,
    });
    if (existingChannel) {
      return res.status(400).json({ message: "Channel already exists" });
    }
    const channel = await Channel.create({ ...req.body ,owner: req.user});
   return res.status(201).json({ message: "Channel created successfully", channel });
  } catch (error) {
    res.status(500).json({ message: "Error creating channel", error: error.message });
  }
}

export async function updateChannel(req, res) {
  try {
    const channelId = req .params.channelId
    const updatedChennel =await Channel.findByIdAndUpdate(channelId,req.body,{new:true,runValidators:true})
    if(!updatedChennel){
       return res.status(404).json({massage:"Chennel not found"})
    }
      return res.status(200).json({massage:"Chennel updated successfully",updatedChennel})
  } catch (error) {
    return res.status(500).json({massage:"Internal server error",error:error.massage})
  }
}


export async function deleteChennel(req, res) {
  try {
    const chennelId = req.params.channelId
    const deletedChennel = await Channel.findByIdAndDelete(chennelId)
    if(!deletedChennel){
        return res.status(404).json({mssage:"Chennel not found"})
    }
    return res.status(200).json({massage:"chennel deleted successfully",deletedChennel})
  } catch (error) {
    return res.status(500).json({massage:"Internal server error",error:error.massage})
  }
}

