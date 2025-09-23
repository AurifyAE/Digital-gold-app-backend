import express from "express";
// Scheme
import { addScheme } from "../controllers/admin/scheme/add";
import { listSchemes } from "../controllers/admin/scheme/list";
import { updateScheme } from "../controllers/admin/scheme/update";
import { deleteScheme } from "../controllers/admin/scheme/delete";

// User
import { listUsers } from "../controllers/admin/user/list";
import { detailsUser } from "../controllers/admin/user/details";
import { updateDetailsUser, blockOrActiveUser } from "../controllers/admin/user/update";
import { deleteUser } from "../controllers/admin/user/delete";

// Kyc
import { pendingKycList } from "../controllers/admin/kyc/list";
import { updateKycStatus } from "../controllers/admin/kyc/update";

// Config
import { addConfig } from "../controllers/admin/config/add";

// AED rate
import { getAedGoldRate, updateAedGoldRate } from "../controllers/admin/config/aedRate";

// Payment
import { listPayments } from "../controllers/admin/payment/list";
import { updatePaymentStatus } from "../controllers/admin/payment/update";

// Middlewares
import { validateScheme } from "../middlewares/validation";
// import {
//     authenticate,
//     authorizeAdmin
// } from "../middlewares/admin/authMiddleware";

const router = express.Router();

// All admin routes require authentication and admin role
// router.use(authenticate, authorizeAdmin);

// Scheme routes
router.get("/scheme", listSchemes);
router.post("/scheme", validateScheme, addScheme);
router.patch("/scheme/:id", updateScheme);
router.delete("/scheme/:id", deleteScheme);

// User routes
router.get("/user", listUsers);
router.get("/user/:id", detailsUser);
router.patch("/user", updateDetailsUser);
router.patch("/user-block", blockOrActiveUser);
router.delete("/user/:id", deleteUser);

// Kyc routes
router.get("/kyc", pendingKycList);
router.patch("/kyc", updateKycStatus);

// Config routes
router.post("/config", addConfig);

// AED rate routes
router.get("/aed-rate", getAedGoldRate);
router.patch("/aed-rate", updateAedGoldRate);

// Payment routes
router.get("/payment", listPayments);
router.patch("/payment", updatePaymentStatus);

export default router;