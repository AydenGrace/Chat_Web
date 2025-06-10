import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const send = (req, res) => {};

export const getUsersForSidebar = async (req, res) => {
  try {
    const LoggedId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne: LoggedId}}).select(
      "-password"
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
