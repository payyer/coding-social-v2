const createVerifyCode = () => {
    // Tạo số ngẫu nhiên từ 0 đến 899999
    const min = 100000;
    const max = 999999;

    // Tạo số ngẫu nhiên trong khoảng từ min đến max
    const token = Math.floor(Math.random() * (max - min + 1)) + min;

    return token;
}

module.exports = { createVerifyCode }