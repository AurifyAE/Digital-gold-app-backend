import express from "express";
import { register, login } from "../controllers/auth";
import {  validateRegister, validateLogin } from "../middlewares/validation";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router;