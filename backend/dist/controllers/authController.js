"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebookLogin = exports.googleLogin = exports.refreshAccessToken = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../config/database"));
const jwt_1 = require("../utils/jwt");
const google_auth_library_1 = require("google-auth-library");
const axios_1 = __importDefault(require("axios"));
const googleClient = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!password || password.length < 8) {
            res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
            return;
        }
        const existing = await database_1.default.user.findUnique({ where: { email } });
        if (existing) {
            res.status(400).json({ success: false, message: 'Email already registered' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = await database_1.default.user.create({
            data: { name, email, password: hashedPassword, phone },
            select: { id: true, name: true, email: true, phone: true, created_at: true }
        });
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        await database_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                user_id: user.id,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: { user, accessToken, refreshToken }
        });
    }
    catch (error) {
        console.error('REGISTER ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.register = register;
// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await database_1.default.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }
        if (!user.is_active) {
            res.status(403).json({ success: false, message: 'Account is deactivated' });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        await database_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                user_id: user.id,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: { id: user.id, name: user.name, email: user.email },
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('LOGIN ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.login = login;
// POST /api/auth/logout
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ success: false, message: 'Refresh token required' });
            return;
        }
        await database_1.default.refreshToken.deleteMany({ where: { token: refreshToken } });
        res.json({ success: true, message: 'Logged out successfully' });
    }
    catch (error) {
        console.error('LOGOUT ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.logout = logout;
// POST /api/auth/refresh
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ success: false, message: 'Refresh token required' });
            return;
        }
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        const stored = await database_1.default.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!stored) {
            res.status(401).json({ success: false, message: 'Invalid refresh token' });
            return;
        }
        if (stored.expires_at < new Date()) {
            await database_1.default.refreshToken.delete({ where: { token: refreshToken } });
            res.status(401).json({ success: false, message: 'Refresh token expired' });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(decoded.userId);
        res.json({ success: true, data: { accessToken } });
    }
    catch (error) {
        console.error('REFRESH ERROR:', error);
        res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }
};
exports.refreshAccessToken = refreshAccessToken;
// POST /api/auth/google
const googleLogin = async (req, res) => {
    try {
        const { token } = req.body; // This is an access_token from frontend
        if (!token) {
            res.status(400).json({ success: false, message: 'Google token required' });
            return;
        }
        // Verify token and get user info from Google
        const { data: payload } = await axios_1.default.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!payload || !payload.email) {
            res.status(400).json({ success: false, message: 'Invalid Google token' });
            return;
        }
        const { email, name } = payload;
        let user = await database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            user = await database_1.default.user.create({
                data: { name: name || 'Google User', email, is_email_verified: true, password: null },
            });
        }
        else if (!user.is_active) {
            res.status(403).json({ success: false, message: 'Account is deactivated' });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        await database_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                user_id: user.id,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        res.json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email },
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('GOOGLE LOGIN ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.googleLogin = googleLogin;
// POST /api/auth/facebook
const facebookLogin = async (req, res) => {
    try {
        const { accessToken: fbAccessToken } = req.body;
        if (!fbAccessToken) {
            res.status(400).json({ success: false, message: 'Facebook token required' });
            return;
        }
        const { data } = await axios_1.default.get(`https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${fbAccessToken}`);
        if (!data || !data.email) {
            res.status(400).json({ success: false, message: 'Invalid Facebook token or missing email. Ensure email permission is granted.' });
            return;
        }
        const { email, name } = data;
        let user = await database_1.default.user.findUnique({ where: { email } });
        if (!user) {
            user = await database_1.default.user.create({
                data: { name: name || 'Facebook User', email, is_email_verified: true, password: null },
            });
        }
        else if (!user.is_active) {
            res.status(403).json({ success: false, message: 'Account is deactivated' });
            return;
        }
        const accessToken = (0, jwt_1.generateAccessToken)(user.id);
        const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
        await database_1.default.refreshToken.create({
            data: {
                token: refreshToken,
                user_id: user.id,
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        res.json({
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email },
                accessToken,
                refreshToken
            }
        });
    }
    catch (error) {
        console.error('FACEBOOK LOGIN ERROR:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.facebookLogin = facebookLogin;
