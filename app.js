const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")

app.set("view engine",'ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen("8080", () => {
  console.log("server is running at port 8080");
});

app.get("/", (req, res) => {
  res.send("root is working");
});

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by the beach",
//         price:1200,
//         location:"california",
//         country:"usa"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("working");
    
// })

//index route
app.get("/listings",async(req,res)=>{
    const allListing= await Listing.find({});
    res.render("listing/index.ejs",{allListing})
})

//new route
app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
})

//show route
app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs",{listing})
})

//create route
app.post("/listings",async(req,res)=>{
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
});

//Edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{listing});
})

//Update route

app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listings");

});

//Delete route

app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
});