var jwt = require('jsonwebtoken');
const tokenModel = require('../model/token.model');

const createToken = async (payload) => {
    const accessToken = await jwt.sign(payload, "PublicKey", { expiresIn: "15m" })
    const refreshToken = await jwt.sign(payload, "PrivateKey", { expiresIn: "2days" })
    return { accessToken, refreshToken }
}

const checkAuth = async (req, res, next) => {
    const { accessToken } = req.cookies
    if (!accessToken) {
        return res.status(403).json({
            message: "Forbidden",
            code: 403
        })
    }
    jwt.verify(accessToken, "PublicKey", async (error, user) => {
        if (error && error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Mã token đã hết hạn",
                code: 401
            })
        }
        if (error) {
            return res.status(403).json({
                message: "Mã token không hợp lệ",
                code: 403
            })
        }
        const foundTokenStore = await tokenModel.findOne({ user_id: user.userId })
        if (!foundTokenStore) return res.status(404).json({ message: "Không tìm thấy token store, vui lồng đăng nhập lại", code: 404 })
        req.user = {
            userId: user.userId,
            role: user.role
        }
        next()
    })
}

module.exports = { createToken, checkAuth }