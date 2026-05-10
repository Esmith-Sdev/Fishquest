import express from "express";
import jwt from "jsonwebtoken";
import Buddies from "../models/Buddies.js";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  removeFriends,
} from "../controllers/buddiesController.js";
import { protect } from "../middleware/requireAuth.js";
const router = express.Router();
router.post("/request", protect, sendFriendRequest);
router.get("/requests", protect, getFriendRequests);
router.patch("/requests/:requestId/accept", protect, getFriendRequests);
router.patch("/requests/:requestId/decline", protect, declineFriendRequest);
router.get("/friends", protect, getFriends);
router.delete("/friends/:friendId", protect, removeFriends);
export default router;
