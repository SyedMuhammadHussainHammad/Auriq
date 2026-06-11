"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromWishlist = exports.addToWishlist = exports.getWishlist = void 0;
const database_1 = __importDefault(require("../config/database"));
const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        let wishlist = await database_1.default.wishlist.findUnique({
            where: { user_id: userId },
            include: {
                items: {
                    include: {
                        product: {
                            include: {
                                variants: true,
                                images: { orderBy: { sort_order: 'asc' } }
                            }
                        }
                    }
                }
            }
        });
        if (!wishlist) {
            // Create empty wishlist if it doesn't exist
            wishlist = await database_1.default.wishlist.create({
                data: { user_id: userId },
                include: {
                    items: {
                        include: {
                            product: {
                                include: {
                                    variants: true,
                                    images: true
                                }
                            }
                        }
                    }
                }
            });
        }
        res.json({ success: true, data: wishlist });
    }
    catch (error) {
        console.error('GET WISHLIST ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getWishlist = getWishlist;
const addToWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { product_id } = req.body;
        if (!product_id) {
            res.status(400).json({ success: false, message: 'Product ID is required' });
            return;
        }
        let wishlist = await database_1.default.wishlist.findUnique({ where: { user_id: userId } });
        if (!wishlist) {
            wishlist = await database_1.default.wishlist.create({ data: { user_id: userId } });
        }
        // Check if already in wishlist
        const existingItem = await database_1.default.wishlistItem.findUnique({
            where: {
                wishlist_id_product_id: {
                    wishlist_id: wishlist.id,
                    product_id: parseInt(product_id)
                }
            }
        });
        if (existingItem) {
            res.status(400).json({ success: false, message: 'Product already in wishlist' });
            return;
        }
        const wishlistItem = await database_1.default.wishlistItem.create({
            data: {
                wishlist_id: wishlist.id,
                product_id: parseInt(product_id)
            },
            include: {
                product: {
                    include: { images: true, variants: true }
                }
            }
        });
        res.json({ success: true, data: wishlistItem, message: 'Added to wishlist' });
    }
    catch (error) {
        console.error('ADD TO WISHLIST ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.addToWishlist = addToWishlist;
const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = parseInt(req.params.productId);
        const wishlist = await database_1.default.wishlist.findUnique({ where: { user_id: userId } });
        if (!wishlist) {
            res.status(404).json({ success: false, message: 'Wishlist not found' });
            return;
        }
        await database_1.default.wishlistItem.delete({
            where: {
                wishlist_id_product_id: {
                    wishlist_id: wishlist.id,
                    product_id: productId
                }
            }
        });
        res.json({ success: true, message: 'Removed from wishlist' });
    }
    catch (error) {
        console.error('REMOVE FROM WISHLIST ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.removeFromWishlist = removeFromWishlist;
