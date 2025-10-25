import express from "express";
import { listSchemes } from "../controllers/user/scheme/list";
import { selectScheme } from "../controllers/user/scheme/select";
import { selectedSchemesList } from "../controllers/user/scheme/selectedSchemesList";
import { aimCalculation, addAim } from "../controllers/user/aim/add";
import { listAims } from "../controllers/user/aim/list";
import { addAddress } from "../controllers/user/address/add";
import { getAddress } from "../controllers/user/address/get";
import { updateAddress } from "../controllers/user/address/update";
import { addKyc } from "../controllers/user/kyc/add";
import { getKyc } from "../controllers/user/kyc/get";
import { updateKyc } from "../controllers/user/kyc/update";
import { getProfile } from "../controllers/user/profile/get";
import { updateDetails } from "../controllers/user/profile/update";
import { paymentSuccess, walletPayment } from "../controllers/user/wallet/payment";
import { getTransactions } from "../controllers/user/transaction/details";
import { listProduct } from "../controllers/user/product/list";

// Middlewares
import {
    validateAim,
    validateAddress,
    validateUpdateAddress
} from "../middlewares/validation";
import {
    authenticate,
    authorizeUser
} from "../middlewares/user/authMiddleware";
import FileUpload from "../services/fileUpload";

const router = express.Router();
const fileUpload = new FileUpload();
const upload = fileUpload.s3Storage();

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
router.patch("/address", validateUpdateAddress, updateAddress);

// Kyc routes
router.post(
    "/kyc",
    upload.fields([
        { name: "emirates_id_front_img", maxCount: 1 },
        { name: "emirates_id_back_img", maxCount: 1 },
        { name: "visa_copy", maxCount: 1 },
    ]),
    addKyc
);
router.get("/kyc", getKyc);
router.patch(
    "/kyc",
    upload.fields([
        { name: "emirates_id_front_img", maxCount: 1 },
        { name: "emirates_id_back_img", maxCount: 1 },
        { name: "visa_copy", maxCount: 1 },
    ]),
    updateKyc
);

// Profile routes
router.get("/profile", getProfile);
router.patch("/profile", updateDetails);

// Wallet payment route
router.post("/wallet/payment", walletPayment);
router.post("/payment/success", paymentSuccess);

// Transaction routes
router.get("/transaction", getTransactions);

// Product routes
router.get("/products", listProduct);

export default router;