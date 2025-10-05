const mongoose=require('mongoose');

async function connectToDb(){
    try{
    await mongoose.connect(process.env.DB_CONNECT);
    console.log('MongoDBconnected...');

    }catch(err){
          console.log(err.message);
          process.exit(1);
    }
}

module.exports=connectToDb;