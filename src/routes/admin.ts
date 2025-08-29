import express from "express";
import { validateScheme } from "../middlewares/validation";
// Scheme
import { addScheme } from "../controllers/admin/scheme/add";
import { listSchemes } from "../controllers/admin/scheme/list";
import { updateScheme } from "../controllers/admin/scheme/update";
import { deleteScheme } from "../controllers/admin/scheme/delete";

// User
import { listUsers } from "../controllers/admin/user/list";
import { updateUser } from "../controllers/admin/user/update";
import { deleteUser } from "../controllers/admin/user/delete";

const router = express.Router();

// Scheme routes
router.get("/schemes", listSchemes);
router.post("/scheme", validateScheme, addScheme);
router.patch("/scheme/:id", updateScheme);
router.delete("/scheme/:id", deleteScheme);

// User routes
router.get("/users", listUsers);
router.patch("/user", updateUser);
router.delete("/user/:id", deleteUser);


export default router;