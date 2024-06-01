const mongoose = require("mongoose")
const connectionString = `mongodb+srv://lequocanh:Ro8423631@doantotnghiep.w1jgvxe.mongodb.net/CodingSocial?retryWrites=true&w=majority&appName=DoAnTotNghiep`; const connectToDB = async () => {
    try {
        await mongoose.connect(connectionString, {
            autoIndex: true
        })
        console.log('Connected to Mongodb Atlas');
    } catch (error) {
        console.error(error);
    }
}
module.exports = connectToDB 