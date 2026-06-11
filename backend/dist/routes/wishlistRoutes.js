"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const wishlistController_1 = require("../controllers/wishlistController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protect all wishlist routes
router.use(authMiddleware_1.verifyUser);
router.get('/', wishlistController_1.getWishlist);
router.post('/add', wishlistController_1.addToWishlist);
router.delete('/remove/:productId', wishlistController_1.removeFromWishlist);
exports.default = router;
