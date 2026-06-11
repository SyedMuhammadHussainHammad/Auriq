"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Protect all user routes
router.use(authMiddleware_1.verifyUser);
// Profile
router.get('/profile', userController_1.getProfile);
router.put('/profile', userController_1.updateProfile);
router.put('/password', userController_1.updatePassword);
// Addresses
router.get('/addresses', userController_1.getAddresses);
router.post('/addresses', userController_1.createAddress);
router.put('/addresses/:id', userController_1.updateAddress);
router.delete('/addresses/:id', userController_1.deleteAddress);
exports.default = router;
