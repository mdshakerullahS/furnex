import Message from "../models/message.model.js";

export const createMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ message: "Fill up required fields" });

    await Message.create({ name, email, subject, message });

    return res.status(201).json({
      message: "Message received successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json({ submissions: messages });
  } catch (err) {
    next(err);
  }
};

export const updateMessageStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const message = await Message.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res
      .status(200)
      .json({ message: "Message status updated", data: message });
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    next(err);
  }
};
