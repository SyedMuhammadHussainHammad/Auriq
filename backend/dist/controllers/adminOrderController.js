"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getAllOrders = void 0;
const database_1 = __importDefault(require("../config/database"));
const getAllOrders = async (req, res) => {
    try {
        const orders = await database_1.default.order.findMany({
            include: {
                user: { select: { name: true, email: true } },
                items: true,
                address: true
            },
            orderBy: { created_at: 'desc' }
        });
        res.json({ success: true, data: orders });
    }
    catch (error) {
        console.error('GET ALL ORDERS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAllOrders = getAllOrders;
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await database_1.default.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });
        res.json({ success: true, data: order });
    }
    catch (error) {
        console.error('UPDATE ORDER STATUS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
