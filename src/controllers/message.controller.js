import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const send = async (req, res) => {
  try {
    const {id: receiverId} = req.params;
    const senderId = req.user._id;
    const {text, image} = req.body;
    if (!text && !image)
      return res
        .status(400)
        .json({message: "Le message doit avoir un contenu."});

    if (!(await User.findById(receiverId)))
      return res.status(400).json({message: "Utilisateur inconnu."});

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      image: imageUrl,
      text,
    });

    if (!newMessage)
      return res.status(400).json({message: "Contenu de message invalide."});

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Send Message error :", error);
    res.status(500);
  }
};

export const getUsersForSidebar = async (req, res) => {
  try {
    const LoggedId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne: LoggedId}}).select(
      "-password -email -createdAt -updatedAt -__v"
    );
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("GetUsersForSidebar error :", error);
    res.status(500);
  }
};

export const getMessages = async (req, res) => {
  try {
    const {id: receiverId} = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        {senderId: myId, receiverId},
        {senderId: receiverId, receiverId: myId},
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("GetMessages error :", error);
    res.status(500);
  }
};
