const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    description:String,
    image:{ 
        type:String,
        default:"https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",//for image undefied no data send
        set:(v)=> v===""?"https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.1.0":v, //for when the user doesnt send any data img form his side
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ],
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;