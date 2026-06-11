"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getAddresses = exports.updatePassword = exports.updateProfile = exports.getProfile = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await database_1.default.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                is_active: true,
                created_at: true,
            }
        });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, data: user });
    }
    catch (error) {
        console.error('GET PROFILE ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getProfile = getProfile;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone } = req.body;
        const user = await database_1.default.user.update({
            where: { id: userId },
            data: { name, phone },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            }
        });
        res.json({ success: true, data: user, message: 'Profile updated successfully' });
    }
    catch (error) {
        console.error('UPDATE PROFILE ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateProfile = updateProfile;
const updatePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        const user = await database_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !user.password) {
            res.status(400).json({ success: false, message: 'Password update not available' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Incorrect current password' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        await database_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        res.json({ success: true, message: 'Password updated successfully' });
    }
    catch (error) {
        console.error('UPDATE PASSWORD ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updatePassword = updatePassword;
const getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await database_1.default.address.findMany({
            where: { user_id: userId },
            orderBy: { created_at: 'desc' }
        });
        res.json({ success: true, data: addresses });
    }
    catch (error) {
        console.error('GET ADDRESSES ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getAddresses = getAddresses;
const createAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { label, full_name, phone, street, city, province, postal_code, is_default } = req.body;
        if (is_default) {
            // Unset other defaults if this one is set to default
            await database_1.default.address.updateMany({
                where: { user_id: userId, is_default: true },
                data: { is_default: false }
            });
        }
        const address = await database_1.default.address.create({
            data: {
                user_id: userId,
                label: label || 'Home',
                full_name,
                phone,
                street,
                city,
                province,
                postal_code,
                is_default: is_default || false
            }
        });
        res.json({ success: true, data: address, message: 'Address created successfully' });
    }
    catch (error) {
        console.error('CREATE ADDRESS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.createAddress = createAddress;
const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = parseInt(req.params.id);
        const { label, full_name, phone, street, city, province, postal_code, is_default } = req.body;
        const existing = await database_1.default.address.findUnique({ where: { id: addressId } });
        if (!existing || existing.user_id !== userId) {
            res.status(404).json({ success: false, message: 'Address not found' });
            return;
        }
        if (is_default && !existing.is_default) {
            await database_1.default.address.updateMany({
                where: { user_id: userId, is_default: true },
                data: { is_default: false }
            });
        }
        const address = await database_1.default.address.update({
            where: { id: addressId },
            data: { label, full_name, phone, street, city, province, postal_code, is_default }
        });
        res.json({ success: true, data: address, message: 'Address updated successfully' });
    }
    catch (error) {
        console.error('UPDATE ADDRESS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateAddress = updateAddress;
const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const addressId = parseInt(req.params.id);
        const existing = await database_1.default.address.findUnique({ where: { id: addressId } });
        if (!existing || existing.user_id !== userId) {
            res.status(404).json({ success: false, message: 'Address not found' });
            return;
        }
        await database_1.default.address.delete({ where: { id: addressId } });
        res.json({ success: true, message: 'Address deleted successfully' });
    }
    catch (error) {
        console.error('DELETE ADDRESS ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.deleteAddress = deleteAddress;
