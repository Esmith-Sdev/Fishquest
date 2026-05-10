import express from "express";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  declineFriendRequest,
  getFriends,
  removeFriend,
} from "../controllers/buddiesController.js";
import { protect } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/request/:receiverId", protect, sendFriendRequest);
router.get("/requests", protect, getFriendRequests);
router.patch("/requests/:requestId/accept", protect, acceptFriendRequest);
router.patch("/requests/:requestId/decline", protect, declineFriendRequest);
router.get("/", protect, getFriends);
router.delete("/:friendId", protect, removeFriend);
export default router;
