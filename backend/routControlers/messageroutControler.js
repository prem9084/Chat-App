import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getReciverSocketId, io } from "../Socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { messages } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    let chats = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    });

    if (!chats) {
      chats = await Conversation.create({
        participants: [senderId, reciverId],
      });
    }

    const newMessages = new Message({
      senderId,
      reciverId,
      message: messages,
      conversationId: chats._id,
    });

    if (newMessages) {
      chats.messages.push(newMessages._id);
    }

    await Promise.all([chats.save(), newMessages.save()]);

    //SOCKET.IO function
    const reciverSocketId = getReciverSocketId(reciverId);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMessage", newMessages);
    }

    res.status(201).send(newMessages);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(`error in sendMessage ${error}`);
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    const chats = await Conversation.findOne({
      participants: { $all: [senderId, reciverId] },
    }).populate("messages");

    if (!chats) return res.status(200).send([]);
    const message = chats.messages;
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(`error in getMessage ${error}`);
  }
};

export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { message: newMessage } = req.body;
    const senderId = req.user?._id || req.userId;

    if (!senderId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User ID not found.",
      });
    }

    if (!newMessage || newMessage.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message content is required.",
      });
    }

    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, senderId },
      { message: newMessage, edited: true },
      { new: true } // return the updated document
    );

    if (!updatedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found or unauthorized to update.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message updated successfully.",
      data: updatedMessage,
    });
  } catch (error) {
    console.error("Error in updateMessage:", error);
    res.status(500).json({
      success: false,
      message: "Server error during message update.",
      error: error.message,
    });
  }
};

// Delete a message
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed. User ID not found.",
      });
    }

    // Find the message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if the user is the sender of the message
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own messages",
      });
    }

    // Find conversation and remove message reference
    const conversation = await Conversation.findById(message.conversationId);
    if (conversation) {
      conversation.messages = conversation.messages.filter(
        (id) => id.toString() !== messageId
      );
      await conversation.save();
    }

    // Delete the message
    await Message.findByIdAndDelete(messageId);

    // Notify other user with socket.io
    const receiverSocketId = getReciverSocketId(message.reciverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("messageDeleted", messageId);
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.log(`Error in deleteMessage: ${error}`);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
