const mongoose = require('mongoose');

const connect = (cb) => {
    mongoose.connect(process.env.MONGO_URL,(err)=>{
        if(err) {
            console.log(err);
            return;
        }
        console.log('Successfully Connected');
        cb();
    }) 
}

module.exports = {
    connect
}