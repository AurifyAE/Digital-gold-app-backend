import express from "express";
import { addScheme } from "../controllers/admin/scheme/add";
import { validateScheme } from "../middlewares/validation";

const router = express.Router();

router.post("/scheme", validateScheme, addScheme);

export default router;