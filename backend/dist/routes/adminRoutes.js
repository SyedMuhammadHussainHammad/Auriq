"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const adminAuthController_1 = require("../controllers/adminAuthController");
const adminProductController_1 = require("../controllers/adminProductController");
const adminCategoryController_1 = require("../controllers/adminCategoryController");
const adminAdController_1 = require("../controllers/adminAdController");
const adminOrderController_1 = require("../controllers/adminOrderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Auth routes (public)
router.post('/login', adminAuthController_1.adminLogin);
// Protected Admin Routes
router.use(authMiddleware_1.verifyAdmin);
// Products
router.get('/products', adminProductController_1.getAllProducts);
router.post('/products', uploadMiddleware_1.upload.array('images', 5), adminProductController_1.createProduct);
// Categories
router.post('/categories', adminCategoryController_1.createCategory);
router.put('/categories/:id', adminCategoryController_1.updateCategory);
// Ads
router.get('/ads', adminAdController_1.getAllAds);
router.post('/ads', uploadMiddleware_1.upload.single('image'), adminAdController_1.createAd);
// Orders
router.get('/orders', adminOrderController_1.getAllOrders);
router.put('/orders/:id/status', adminOrderController_1.updateOrderStatus);
exports.default = router;
