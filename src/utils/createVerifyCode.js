const { default: mongoose } = require("mongoose");
const cloudinary = require("../utils/cloudinary")

const createVerifyCode = () => {
    // Tạo số ngẫu nhiên từ 0 đến 899999
    const min = 100000;
    const max = 999999;

    // Tạo số ngẫu nhiên trong khoảng từ min đến max
    const token = Math.floor(Math.random() * (max - min + 1)) + min;

    return token;
}

const convertToObjectId = (id) => {
    const result = new mongoose.Types.ObjectId(id)
    return result
}

const removeVietnameseTones = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D');
}


const uploadFile = async (files) => {
    return await Promise.all(
        files.map(async (file) => {
            const { public_id, secure_url, resource_type } = await cloudinary.uploader.upload(file.path, {
                resource_type: 'auto', folder: 'SocialMedia'
            });
            return { public_id, secure_url, resource_type }
        })
    );
}

module.exports = { createVerifyCode, convertToObjectId, removeVietnameseTones, uploadFile }