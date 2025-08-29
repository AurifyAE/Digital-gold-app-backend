import express from "express";
import { register, login, logout } from "../controllers/auth";
import {  validateRegister, validateLogin } from "../middlewares/validation";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/logout/:id", logout);

export default router;