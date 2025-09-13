import express from "express";
import { listSchemes } from "../controllers/user/scheme/list";
import { selectScheme } from "../controllers/user/scheme/select";
import { selectedSchemesList } from "../controllers/user/scheme/selectedSchemesList";
import { aimCalculation, addAim } from "../controllers/user/aim/add";
import { listAims } from "../controllers/user/aim/list";
import { addAddress } from "../controllers/user/address/add";
import { getAddress } from "../controllers/user/address/get";
import { updateAddress } from "../controllers/user/address/update";
import { getProfile } from "../controllers/user/profile/get";
import { walletPayment } from "../controllers/user/wallet/payment";

// Middlewares
import {
    validateAim,
    validateAddress
} from "../middlewares/validation";
import {
    authenticate,
    authorizeUser
} from "../middlewares/user/authMiddleware";

const router = express.Router();

// All user routes require authentication and user role
router.use(authenticate, authorizeUser);

// Scheme routes
router.get("/scheme", listSchemes);
router.post("/scheme", selectScheme);
router.get("/scheme-selected", selectedSchemesList);

// Aim routes
router.post("/aim-calculation", aimCalculation);
router.post("/aim", validateAim, addAim);
router.get("/aim", listAims);

// Address routes
router.post("/address", validateAddress, addAddress);
router.get("/address", getAddress);
router.patch("/address", updateAddress);

// Profile routes
router.get("/profile", getProfile);

// Wallet payment route
router.post("/wallet/payment", walletPayment);

export default router;