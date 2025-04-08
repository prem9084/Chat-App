import express from "express";
import {
  deleteMessage,
  getMessages,
  sendMessage,
  updateMessage,
} from "../routControlers/messageroutControler.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post("/send/:id", isLogin, sendMessage);

router.get("/:id", isLogin, getMessages);
router.put("/update/:messageId", isLogin, updateMessage);
router.delete("/delete/:messageId", isLogin, deleteMessage);

export default router;
