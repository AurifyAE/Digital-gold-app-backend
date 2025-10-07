import express from "express";
// Scheme
import { addScheme } from "../controllers/admin/scheme/add";
import { listSchemes } from "../controllers/admin/scheme/list";
import { updateScheme } from "../controllers/admin/scheme/update";
import { deleteScheme } from "../controllers/admin/scheme/delete";

// Static aim
import { listStaticAim } from "../controllers/admin/static-aim/list";
import { updateStaticAim } from "../controllers/admin/static-aim/update";
import { addStaticAim } from "../controllers/admin/static-aim/add";
import { deleteStaticAim } from "../controllers/admin/static-aim/delete";

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
import { updateConfig } from "../controllers/admin/config/update";

// AED rate
import { getAedGoldRate, updateAedGoldRate } from "../controllers/admin/config/aedRate";

// Payment
import { listPayments } from "../controllers/admin/payment/list";
import { updatePaymentStatus } from "../controllers/admin/payment/update";

// Category
import { addCategory } from "../controllers/admin/category/add";
import { listCategory } from "../controllers/admin/category/list";
import { updateCategory } from "../controllers/admin/category/update";
import { deleteCategory } from "../controllers/admin/category/delete";

// Product
import { addProduct } from "../controllers/admin/product/add";
import { listProduct } from "../controllers/admin/product/list";

// Middlewares
import { validateScheme } from "../middlewares/validation";
import {
    authenticate,
    authorizeAdmin
} from "../middlewares/admin/authMiddleware";
import FileUpload from "../services/fileUpload";

const router = express.Router();
const fileUpload = new FileUpload();
const upload = fileUpload.s3Storage();

// All admin routes require authentication and admin role
router.use(authenticate, authorizeAdmin);

// Scheme routes
router.get("/scheme", listSchemes);
router.post("/scheme", validateScheme, addScheme);
router.patch("/scheme/:id", updateScheme);
router.delete("/scheme/:id", deleteScheme);

// Static aim routes
router.post("/static-aim", addStaticAim);
router.get("/static-aim", listStaticAim);
router.patch("/static-aim", updateStaticAim);
router.delete("/static-aim/:id", deleteStaticAim);

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
router.patch("/config", updateConfig);

// AED rate routes
router.get("/aed-rate", getAedGoldRate);
router.patch("/aed-rate", updateAedGoldRate);

// Payment routes
router.get("/payment", listPayments);
router.patch("/payment", updatePaymentStatus);

// Category routes
router.post("/category", addCategory);
router.get("/category", listCategory);
router.patch("/category", updateCategory);
router.delete("/category/:id", deleteCategory);

// Product routes
router.post("/product", upload.single("image"), addProduct);
router.get("/product", listProduct);

export default router;