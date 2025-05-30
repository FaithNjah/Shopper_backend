require("dotenv").config();

const express = require("express");
const {connectToDatabase} = require('./Database/database');
const cors = require('cors');

const app = express();
const Port = process.env.PORT || 8080;
const shopRoutes =require('./routes/indexRouter');
const productRoutes =require('./routes/productRoutes');
const userRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/cart');



app.use(express.json())

app.use(cors({exposedHeader: 'x-auth-token'}))

app.use('/', shopRoutes)
app.use('/', productRoutes)
app.use('/', userRoutes)
app.use('/', cartRoutes); 





connectToDatabase().then(()=>{
    console.log(`connected on ${Port}`)
});

app.listen(Port,()=>{
    console.log('works!')
})
