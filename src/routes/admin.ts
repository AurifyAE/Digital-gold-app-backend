import express from "express";
import { validateScheme } from "../middlewares/validation";
import { addScheme } from "../controllers/admin/scheme/add";
import { listSchemes } from "../controllers/admin/scheme/list";

const router = express.Router();

router.get("/schemes", listSchemes);
router.post("/scheme", validateScheme, addScheme);

export default router;