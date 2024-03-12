const express = require('express');
const mongoose = require('mongoose')
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT;  

// middleware 
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(expressLayouts)
app.use(cookieParser('CookingBlogSecure'));
app.use(session({
  secret: 'CookingBlogSecretSession',
  saveUninitialized: true,
  resave: true
}));
app.use(flash());
app.use(fileUpload());

app.set('layout', './layouts/main')
app.set('view engine', 'ejs');

// database connectivity - 
mongoose.connect(process.env.MONGODB_URL).then(app.listen(PORT, ()=>{
    console.log('app is listing at the port ')
})).catch((err)=>{console.log(err)})


// routing - 
const routes = require('./routes/recipeRoutes.js')
app.use('/', routes);

