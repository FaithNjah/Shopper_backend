const mongoose = require('mongoose');
const url = "mongodb+srv://faith:faith@cluster0.0cycz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectToDatabase = async () => {
    const connected = await mongoose.connect(url);
    if(connected){
        console.log('successful!')
    }
}

module.exports = {connectToDatabase}