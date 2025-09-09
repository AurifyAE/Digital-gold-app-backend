import express from "express";
import { listSchemes } from "../controllers/user/scheme/list";
import { selectScheme } from "../controllers/user/scheme/select";
import { selectedSchemesList } from "../controllers/user/scheme/selectedSchemesList";
import { payment } from "../controllers/user/scheme/payment";
import { addAim } from "../controllers/user/aim/add";
import { listAims } from "../controllers/user/aim/list";
import { aimPayment } from "../controllers/user/aim/payment";
import { addAddress } from "../controllers/user/address/add";
import { getAddress } from "../controllers/user/address/get";
import { updateAddress } from "../controllers/user/address/update";

import {
    validateAim,
    validateAddress
} from "../middlewares/validation";

const router = express.Router();

// Scheme routes
router.get("/scheme", listSchemes);
router.post("/scheme", selectScheme);
router.get("/scheme-selected", selectedSchemesList);
router.post("/scheme/payment", payment);

// Aim routes
router.post("/aim", validateAim, addAim);
router.get("/aim", listAims);
router.patch("/aim/payment", aimPayment);

// Address routes
router.post("/address", validateAddress, addAddress);
router.get("/address/:id", getAddress);
router.patch("/address", updateAddress);


export default router;