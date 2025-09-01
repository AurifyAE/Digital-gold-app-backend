import express from "express";
import { listSchemes } from "../controllers/user/scheme/list";
import { selectScheme } from "../controllers/user/scheme/select";
import { selectedSchemesList } from "../controllers/user/scheme/selectedSchemesList";
import { payment } from "../controllers/user/scheme/payment";

const router = express.Router();

router.get("/scheme", listSchemes);
router.post("/scheme", selectScheme);
router.get("/scheme-selected", selectedSchemesList);
router.post("/scheme/payment", payment);

export default router;