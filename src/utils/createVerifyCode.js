const { default: mongoose } = require("mongoose");

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

module.exports = { createVerifyCode, convertToObjectId, removeVietnameseTones }