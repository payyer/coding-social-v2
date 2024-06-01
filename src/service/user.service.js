const userModel = require("../model/user.model")
const nodemailer = require("nodemailer");
const { createVerifyCode } = require("../utils/createVerifyCode");

const findUserByEmail = async (email) => {
    return await userModel.findOne({ user_email: email })
}

const sendVerifyCodeByEmailService = async (email, code) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "anhhocfullstack@gmail.com",
            pass: "dkzc gqko wvye rgmt",
        },
    });


    async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Coding Social" <anhhocfullstack@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Verify Coding Social Account", // Subject line
            text: "Xin chào! Đây là Coding Social. Đừng chia sẽ mã xác thực cho bất cứ ai để bảo đám an toàn cho bạn", // plain text body
            html: `<h1>Code: ${code}</h1>`,
        });

        console.log("Message sent: %s", info.messageId);
    }
    main().catch(console.error);
}

module.exports = { findUserByEmail, sendVerifyCodeByEmailService }