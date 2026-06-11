"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../config/database"));
const env_1 = require("../config/env");
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await database_1.default.admin.findUnique({ where: { email } });
        if (!admin) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const isValid = await bcrypt_1.default.compare(password, admin.password);
        if (!isValid) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email, role: 'ADMIN' }, env_1.ENV.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: admin.id, role: 'ADMIN' }, env_1.ENV.JWT_REFRESH_SECRET, { expiresIn: '7d' });
        await database_1.default.adminRefreshToken.create({
            data: {
                token: refreshToken,
                admin_id: admin.id,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        res.json({
            success: true,
            data: {
                admin: { id: admin.id, name: admin.name, email: admin.email },
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('ADMIN LOGIN ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.adminLogin = adminLogin;
