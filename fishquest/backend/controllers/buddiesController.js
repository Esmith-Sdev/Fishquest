import mongoose from "mongoose";
import User from "../models/User.js";
import FriendRequest from "../models/Buddies.js";

export async function sendFriendRequest(req, res) {
  try {
    const senderId = req.user.id;
    const { receiverId } = req.params;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "You cannot add yourself." });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found." });
    }

    const sender = await User.findById(senderId);

    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({ message: "Already friends." });
    }

    const existingRequest = await FriendRequest.findOne({
      senderId,
      receiverId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent." });
    }

    const friendRequest = await FriendRequest.create({
      senderId,
      receiverId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ message: "Failed to send friend request." });
  }
}

export async function getFriendRequests(req, res) {
  try {
    console.log("Checking requests for:", req.user.id);

    const requests = await FriendRequest.find({
      receiverId: new mongoose.Types.ObjectId(req.user.id),
      status: "pending",
    }).populate("senderId", "username email");

    console.log("Found requests:", requests);

    res.json(requests);
  } catch (error) {
    console.log("Failed to fetch friend requests:", error);
    res.status(500).json({ message: "Failed to fetch friend requests." });
  }
}

export async function acceptFriendRequest(req, res) {
  try {
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    if (request.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed." });
    }

    await User.findByIdAndUpdate(request.senderId, {
      $addToSet: { friends: request.receiverId },
    });

    await User.findByIdAndUpdate(request.receiverId, {
      $addToSet: { friends: request.senderId },
    });

    request.status = "accepted";
    await request.save();

    res.json({ message: "Friend request accepted." });
  } catch (error) {
    res.status(500).json({ message: "Failed to accept friend request." });
  }
}

export async function declineFriendRequest(req, res) {
  try {
    const { requestId } = req.params;

    const request = await FriendRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ message: "Friend request not found." });
    }

    if (request.receiverId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed." });
    }

    request.status = "declined";
    await request.save();

    res.json({ message: "Friend request declined." });
  } catch (error) {
    res.status(500).json({ message: "Failed to decline friend request." });
  }
}

export async function getFriends(req, res) {
  try {
    const user = await User.findById(req.user.id).populate(
      "friends",
      "username email",
    );

    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch friends." });
  }
}

export async function removeFriend(req, res) {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
    });

    res.json({ message: "Friend removed." });
  } catch (error) {
    res.status(500).json({ message: "Failed to remove friend." });
  }
}

export async function searchUsers(req, res) {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.json([]);
    }

    const users = await User.find({
      username: {
        $regex: query,
        $options: "i",
      },
      _id: {
        $ne: req.user.id,
      },
    })
      .select("username profileImage")
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to search users.",
    });
  }
}
