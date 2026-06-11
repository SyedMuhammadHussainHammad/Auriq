"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProducts = exports.createProduct = void 0;
const database_1 = __importDefault(require("../config/database"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: 'auriq_products' }, (error, result) => {
            if (result)
                resolve(result);
            else
                reject(error);
        });
        uploadStream.end(buffer);
    });
};
const revalidateFrontend = async (tag) => {
    try {
        // Attempt to revalidate frontend cache
        await axios_1.default.post('http://localhost:3000/api/revalidate', {
            tag,
            secret: env_1.ENV.REVALIDATION_SECRET
        });
    }
    catch (error) {
        console.error('Failed to revalidate frontend cache:', error);
    }
};
const createProduct = async (req, res) => {
    try {
        const { name, brand, description, category_id, is_active, is_featured, is_best_seller, variants_json } = req.body;
        const files = req.files;
        let uploadedImages = [];
        if (files && files.length > 0) {
            for (const file of files) {
                const result = await uploadToCloudinary(file.buffer);
                uploadedImages.push(result.secure_url);
            }
        }
        const product = await database_1.default.product.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/ /g, '-'),
                brand,
                description,
                category_id: parseInt(category_id),
                is_active: is_active === 'true',
                is_featured: is_featured === 'true',
                is_best_seller: is_best_seller === 'true',
                images: {
                    create: uploadedImages.map((url, index) => ({
                        image_url: url,
                        sort_order: index
                    }))
                }
            }
        });
        if (variants_json) {
            const variants = JSON.parse(variants_json);
            for (const v of variants) {
                await database_1.default.productVariant.create({
                    data: {
                        product_id: product.id,
                        size_ml: v.size_ml,
                        price: v.price,
                        stock_quantity: v.stock_quantity,
                        sku: v.sku
                    }
                });
            }
        }
        await revalidateFrontend('products');
        res.json({ success: true, data: product });
    }
    catch (error) {
        console.error('CREATE PRODUCT ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createProduct = createProduct;
const getAllProducts = async (req, res) => {
    try {
        const products = await database_1.default.product.findMany({
            include: {
                category: true,
                variants: true,
                images: true,
            }
        });
        res.json({ success: true, data: products });
    }
    catch (error) {
        console.error('ADMIN GET PRODUCTS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllProducts = getAllProducts;
