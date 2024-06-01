const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userModel = require("../model/user.model");
const tokenModel = require("../model/token.model");
const { createToken } = require("../auth/authentication");
const { createVerifyCode } = require("../utils/createVerifyCode");
const { sendVerifyCodeByEmailService } = require("../service/user.service");

const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!email) return res.json({ message: "Cần nhập email", code: 400 });
        if (!name) return res.json({ message: "Cần nhập name", code: 400 });
        if (!password) return res.json({ message: "Cần nhập password", code: 400 });
        const findUser = await userModel.findOne({ user_email: email }).lean();
        if (findUser) {
            return res.json({ message: "Email đã tồn tại", code: 400 });
        }

        const saltRounds = 10;
        const passwordHashing = bcrypt.hashSync(password, saltRounds);

        const newAccount = await userModel.create({
            user_name: name,
            user_email: email,
            user_password: passwordHashing,
            email_verify_token: createVerifyCode(),
        });

        return res.json({
            message: "Tạo mới thành công, cần xác nhận email để có thể đăng nhập",
            code: 200,
            metadata: newAccount.user_email,
        });
    } catch (error) {
        return res.json({ error });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { email, verifyCode } = req.body;
        if (!email) return res.json({ message: "Cần nhập email", code: 400 });

        const filter = { email_verify_token: verifyCode };
        const update = { user_verify: true, email_verify_token: createVerifyCode(), };
        const foundEmail = await userModel
            .findOneAndUpdate(filter, update, { new: true })
            .select("user_name _id user_roles");

        if (!foundEmail) {
            return res.status(404).json({
                message: "Email không tồn tại hoặc mã xác nhận không chính xác",
                code: 404,
            });
        }

        const tokenPair = await createToken({
            userId: foundEmail._id,
            role: foundEmail.user_roles
        })

        const foundTokenStore = await tokenModel.findOne({ user_id: foundEmail._id }).lean()
        if (!foundTokenStore) {
            await tokenModel.create({ user_id: foundEmail._id, refresh_token: tokenPair.refreshToken })
        } else {
            await tokenModel.findByIdAndUpdate(foundTokenStore._id, { refresh_token: tokenPair.refreshToken, $push: { refresh_token_list: foundTokenStore.refresh_token } })
        }

        res.cookie('accessToken', tokenPair.accessToken, { maxAge: 15 * 60 * 1000 })
        res.cookie('refreshToken', tokenPair.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

        return res.json({
            message: "Xác nhận thành công",
            code: 200,
            metadata: {
                user: foundEmail,
                tokenPair
            },
        });
    } catch (error) {
        return res.json({ error });
    }
};

const login = async (req, res) => {
    try {

        const { email, password } = req.body
        if (!email) return res.json({ message: "Cần nhập email", code: 400 });
        if (!password) return res.json({ message: "Cần nhập password", code: 400 });

        const findUser = await userModel.findOne({ user_email: email }).select('_id user_name user_verify user_password user_roles').lean();
        if (!findUser) {
            return res.json({ message: "Email không hoặc mật khẩu không hợp lệ", code: 400 });
        }

        if (!findUser.user_verify) {
            return res.json({ message: "Chưa xác thực email", code: 400 });
        }

        const comparePassword = bcrypt.compareSync(password, findUser.user_password);
        if (!comparePassword) {
            return res.json({ message: "Email không hoặc mật khẩu không hợp lệ", code: 400 });
        }

        const tokenPair = await createToken({
            userId: findUser._id,
            role: findUser.user_roles
        })

        const foundTokenStore = await tokenModel.findOne({ user_id: findUser._id }).lean()
        if (!foundTokenStore) {
            await tokenModel.create({ user_id: findUser._id, refresh_token: tokenPair.refreshToken })
        } else {
            await tokenModel.findByIdAndUpdate(foundTokenStore._id, { refresh_token: tokenPair.refreshToken, $push: { refresh_token_list: foundTokenStore.refresh_token } })
        }

        res.cookie('accessToken', tokenPair.accessToken, { maxAge: 15 * 60 * 1000 })
        res.cookie('refreshToken', tokenPair.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

        return res.json({
            message: "Đăng nhập thành công",
            code: 200,
            metadata: {
                user: {
                    id: findUser._id,
                    userName: findUser.user_name,
                    userRole: findUser.user_roles
                },
                tokenPair
            }
        })
    } catch (error) { }
};

const getNewAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies
    if (!refreshToken) return res.status(400).json({ message: "Chưa gửi kèm refresh token" })

    jwt.verify(refreshToken, "PrivateKey", async (error, user) => {
        if (error) return res.status(400).json({ message: "Mã RT không hợp lệ" })
        const foundTokenSotre = await tokenModel.findOne({ user_id: user.userId })
        if (!foundTokenSotre) return res.status(404).json({ message: "Không tìm thấy token store" })

        const checkRefreshTokenIsExits = foundTokenSotre.refresh_token_list.includes(refreshToken)
        if (checkRefreshTokenIsExits) {
            await tokenModel.deleteOne({ user_id: user.userId })
            return res.status(400).json({ message: "Khi vấn bảo mật, mời đăng nhập lại" })
        } else {
            foundTokenSotre.refresh_token_list.push(refreshToken)
            await foundTokenSotre.save()
        }
        const tokenPair = await createToken({ userId: user.userId, role: user.role })

        res.cookie('accessToken', tokenPair.accessToken, { maxAge: 15 * 60 * 1000 })
        res.cookie('refreshToken', tokenPair.refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })

        return res.status(200).json({ tokenPair })
    })
}

const logout = async (req, res) => {
    const userId = req.body.userId

    const foundTokenStore = await tokenModel.findOneAndDelete({
        user_id: new mongoose.Types.ObjectId(userId)
    }).lean()

    res.cookie('accessToken', '', { maxAge: 0 })
    res.cookie('refreshToken', '', { httpOnly: true, maxAge: 0 })

    if (!foundTokenStore) return res.json({ message: "Không tìm thấy token store", code: 404 })
    return res.json({ message: "Đăng xuất thành công", code: 200 })
}

const sendVerifyCodeViaEmail = async (req, res) => {
    const { email } = req.body
    const foundEmail = await userModel.findOne({ user_email: email })
    if (!foundEmail) return res.status(404).json({ message: "Không tìm thấy tài khoản của bạn" })

    await sendVerifyCodeByEmailService(foundEmail.user_email, foundEmail.email_verify_token)

    return res.status(200).json({ message: "Đã gửi mà xác thực!" })
}

const resetPassword = async (req, res) => {
    const { verifyCode, newPassword } = req.body

    const saltRounds = 10;
    const passwordHashing = bcrypt.hashSync(newPassword, saltRounds);

    const foundUser = await userModel.findOneAndUpdate({ email_verify_token: verifyCode }, {
        user_password: passwordHashing,
        email_verify_token: await createVerifyCode()
    })
    if (!foundUser) return res.status(400).json({ message: "Mã xác thực không chính xác" })

    return res.status(200).json({ message: "Thay đổi mật khẩu thành công" })
}

module.exports = { register, login, verifyEmail, getNewAccessToken, logout, sendVerifyCodeViaEmail, resetPassword };
