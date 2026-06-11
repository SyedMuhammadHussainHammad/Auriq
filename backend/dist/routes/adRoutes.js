"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adController_1 = require("../controllers/adController");
const router = (0, express_1.Router)();
router.get('/', adController_1.getActiveAds);
exports.default = router;
