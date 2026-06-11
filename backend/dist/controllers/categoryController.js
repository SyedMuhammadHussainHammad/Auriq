"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllCategories = async (req, res) => {
    try {
        const categories = await database_1.default.category.findMany({
            where: { is_active: true },
            include: {
                products: {
                    take: 4,
                    include: {
                        images: { orderBy: { sort_order: 'asc' }, take: 1 }
                    }
                }
            }
        });
        res.json({ success: true, data: categories });
    }
    catch (error) {
        console.error('GET ALL CATEGORIES ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllCategories = getAllCategories;
