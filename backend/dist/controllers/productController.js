"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getBestSellers = exports.getFeaturedProducts = exports.getAllProducts = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllProducts = async (req, res) => {
    try {
        const products = await database_1.default.product.findMany({
            where: { is_active: true },
            include: {
                category: true,
                variants: true,
                images: { orderBy: { sort_order: 'asc' } },
                fragrance_notes: true,
            }
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        console.error('GET ALL PRODUCTS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllProducts = getAllProducts;
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await database_1.default.product.findMany({
            where: { is_active: true, is_featured: true },
            include: {
                category: true,
                variants: true,
                images: { orderBy: { sort_order: 'asc' } },
            },
            take: 8
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        console.error('GET FEATURED PRODUCTS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
const getBestSellers = async (req, res) => {
    try {
        const products = await database_1.default.product.findMany({
            where: { is_active: true, is_best_seller: true },
            include: {
                category: true,
                variants: true,
                images: { orderBy: { sort_order: 'asc' } },
            },
            take: 8
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        console.error('GET BEST SELLERS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getBestSellers = getBestSellers;
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await database_1.default.product.findUnique({
            where: { id: parseInt(id) },
            include: {
                category: true,
                variants: true,
                images: { orderBy: { sort_order: 'asc' } },
                fragrance_notes: true,
            }
        });
        if (!product || !product.is_active) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.json({ success: true, data: product });
    }
    catch (error) {
        console.error('GET PRODUCT BY ID ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProductById = getProductById;
