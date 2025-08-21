const mongoose = require('mongoose');
const url = url

const connectToDatabase = async () => {
    const connected = await mongoose.connect(url);
    if(connected){
        console.log('successful!')
    }
}

module.exports = {connectToDatabase}