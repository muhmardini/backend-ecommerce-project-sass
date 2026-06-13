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
import { isVerified } from "#features/verification/verify.middleware";
import { createProduct } from "#features/products/product.controller";

const router = express.Router();

// Core Endpoints
router.post("/", authenticate, isVerified, createBusiness);

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

// adding a route to get all products created by this business

router.post("/:slug/products", authenticate, isOwner, createProduct);

router.get("/:slug/products", authenticate, isOwner, getBusinessProducts);

export default router;
