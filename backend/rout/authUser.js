import express from "express";
import {
  getSingleUser,
  userLogOut,
  userLogin,
  userRegister,
  userUpdate,
} from "../routControlers/userroutControler.js";
import isLogin from "../middleware/isLogin.js";
const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.post("/logout", userLogOut);
router.get("/get-user/:id", isLogin, getSingleUser);
router.put("/update/:id", isLogin, userUpdate);
export default router;
