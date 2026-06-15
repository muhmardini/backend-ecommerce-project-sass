import { authenticate } from "#features/auth/auth.middleware";
import express from "express";
import { deleteProfile, editProfile, likedProducts, myProfile } from "./users.controller";

const route = express.Router();

route.get("/me", authenticate, myProfile);

route.patch("/profile", authenticate, editProfile);

route.delete("/delete-profile", authenticate, deleteProfile);

// add a route for all liked products
route.get("/me/liked", likedProducts)
// add a route for all followed businesses

export default route;
