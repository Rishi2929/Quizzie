import { Router } from "express";

import { signup, login, logout, getCurrentUser } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/new", signup);
router.post("/login", login);
router.get("/me", isAuthenticated, getCurrentUser);
router.post("/logout", logout);

// router.get("/me", isAuthenticated, getMyProfile);

export default router;
