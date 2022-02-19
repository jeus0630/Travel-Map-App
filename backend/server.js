const express = require('express');
const dotenv = require('dotenv').config();
const helmet = require('helmet');
const morgan = require('morgan');
const db = require('./config/db');
const app = express();

app.use(helmet());
app.use(morgan('dev'));

const main = () => {
    app.listen(process.env.PORT || 8080, () => {
        console.log(`Backend server is running on port ${process.env.PORT || 8080}`);
    })
} 

db.connect(main);