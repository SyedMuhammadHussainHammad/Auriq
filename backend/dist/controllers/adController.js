"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveAds = void 0;
const database_1 = __importDefault(require("../config/database"));
const getActiveAds = async (req, res) => {
    try {
        const ads = await database_1.default.ad.findMany({
            where: {
                is_active: true,
                OR: [
                    { starts_at: null, ends_at: null },
                    { starts_at: { lte: new Date() }, ends_at: { gte: new Date() } }
                ]
            },
            orderBy: { created_at: 'desc' }
        });
        res.json({ success: true, data: ads });
    }
    catch (error) {
        console.error('GET ACTIVE ADS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getActiveAds = getActiveAds;
