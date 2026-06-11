"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAds = exports.createAd = void 0;
const database_1 = __importDefault(require("../config/database"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({ folder: 'auriq_ads' }, (error, result) => {
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
        await axios_1.default.post('http://localhost:3000/api/revalidate', {
            tag,
            secret: env_1.ENV.REVALIDATION_SECRET
        });
    }
    catch (error) {
        console.error('Failed to revalidate frontend cache:', error);
    }
};
const createAd = async (req, res) => {
    try {
        const { title, link_url, position, is_active } = req.body;
        const file = req.file;
        if (!file) {
            res.status(400).json({ success: false, message: 'Image is required' });
            return;
        }
        const uploadResult = await uploadToCloudinary(file.buffer);
        const ad = await database_1.default.ad.create({
            data: {
                title,
                link_url,
                position,
                is_active: is_active === 'true',
                image_url: uploadResult.secure_url
            }
        });
        await revalidateFrontend('ads');
        res.json({ success: true, data: ad });
    }
    catch (error) {
        console.error('CREATE AD ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createAd = createAd;
const getAllAds = async (req, res) => {
    try {
        const ads = await database_1.default.ad.findMany({
            orderBy: { created_at: 'desc' }
        });
        res.json({ success: true, data: ads });
    }
    catch (error) {
        console.error('GET ALL ADS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllAds = getAllAds;
