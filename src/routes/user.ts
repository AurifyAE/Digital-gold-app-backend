import express from "express";
import { listSchemes } from "../controllers/user/scheme/list";

const router = express.Router();

router.get("/scheme", listSchemes);

export default router;