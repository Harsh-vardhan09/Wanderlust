const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");


// console.log("plugin test" , passportLocalMongoose);

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
})

//passport will automatically input username,password and salt,hashing

userSchema.plugin(passportLocalMongoose.default);

module.exports=mongoose.model('User',userSchema);