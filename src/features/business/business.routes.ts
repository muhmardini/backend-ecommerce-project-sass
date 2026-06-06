import { authenticate } from "#features/auth/auth.middleware";
import express from "express";
import {
  createBusiness,
  editBusiness,
  getBusiness,
  getAllBusiness,
  deleteBusiness,
  myBusinesses,
  newMember,
  editMember,
  getMembers,
  deleteMember,
} from "./business.controller";
import { isOwner } from "./isOwner.middleware";
import { verify } from "#features/verification/verify.middleware";

const router = express.Router();

// Core Endpoints
router.post("/", authenticate, verify, createBusiness);

router.get("/me", authenticate, myBusinesses);

router.get("/", getAllBusiness);

router.get("/:slug", getBusiness);

router.patch("/:slug", authenticate, isOwner, editBusiness);

router.delete("/:slug", authenticate, isOwner, deleteBusiness);

// manage members endpoints
router.post("/:slug/members", authenticate, isOwner, newMember);

router.patch("/:slug/members/:id", authenticate, isOwner, editMember);

router.get("/:slug/members", authenticate, isOwner, getMembers);

router.delete("/:slug/members/:id", authenticate, isOwner, deleteMember);

export default router;
