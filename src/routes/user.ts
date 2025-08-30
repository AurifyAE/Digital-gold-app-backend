import express from "express";
import { listSchemes } from "../controllers/user/scheme/list";
import { selectScheme } from "../controllers/user/scheme/select";

const router = express.Router();

router.get("/scheme", listSchemes);
router.post("/scheme", selectScheme);

export default router;