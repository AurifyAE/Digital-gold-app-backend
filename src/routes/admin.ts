import express from "express";
import { validateScheme } from "../middlewares/validation";
import { addScheme } from "../controllers/admin/scheme/add";
import { listSchemes } from "../controllers/admin/scheme/list";
import { updateScheme } from "../controllers/admin/scheme/update";
import { deleteScheme } from "../controllers/admin/scheme/delete";

const router = express.Router();

router.get("/schemes", listSchemes);
router.post("/scheme", validateScheme, addScheme);
router.patch("/scheme/:id", updateScheme);
router.delete("/scheme/:id", deleteScheme);

export default router;