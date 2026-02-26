// subscriptionRoutes.ts

import express from "express";
import {
  createSubscription,
  deleteSubscription,
  editSubscription,
  getProviderSubscriptions,
} from "../controllers/subscriptionController";
import { authenticate } from "../middleware/auth.middleware"; // Import the authenticate middleware
import { checkRole } from "../middleware/role.middleware";

const router = express.Router();

// Create subscription route (protected route)
router.post("/create", authenticate,  checkRole(['admin', 'provider']), createSubscription);

// Get subscriptions for a provider route (protected route)
router.get("/provider/:providerId", authenticate, checkRole(['admin','provider']), getProviderSubscriptions);

// Edit subscription route (protected route)
router.put("/edit/:subscriptionId", authenticate, checkRole(['admin', 'provider']), editSubscription);

// Delete subscription route (protected route)
router.delete("/delete/:subscriptionId", authenticate,  checkRole(['admin','provider' ]), deleteSubscription);

export default router;
