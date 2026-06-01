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
router.post("/:slug/member", authenticate, isOwner, newMember);

router.patch("/:slug/member/:id", authenticate,isOwner, editMember);

router.delete("/:slug/member/:id", authenticate, isOwner, deleteMember);

export default router;
