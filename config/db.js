const mongoose = require('mongoose');
async function connectToDB(){
   await mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log('connecting to mongodb'))
    .catch((err)=> console.log(err))
}


module.exports = connectToDB