const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const listing=require("./routes/listing.js");
const reviews=require("./routes/review.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionsOptions={
   secret:"mysupersecretcode",
   resave:false,
   saveUninitialized:true,
   cookie:{
    expires:Date.now()+ 7 * 24 * 60 * 60 * 100,
    maxAge:7 * 24 * 60 * 60 * 100,
    httpOnly:true
   }
}

app.get("/", (req, res) => {
  // res.send("root is working");
  // res.render("listing/hero.ejs");
  res.redirect("/listings")
  
});


app.use(session(sessionsOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");

  // console.log(res.locals.success)
  next();
})




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





app.use("/listings",listing);
app.use("/listings/:id/reviews",reviews);//here the /listing/:id stays in this so we cant acess it in review route file to do that we need external  




// for all route that doesn't exist
app.use((req, res, next) => {
  throw new ExpressError(404, "404 Page not found");
});


//error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong" } = err;
  // res.status(statusCode).send(err);
  res.status(statusCode).render("./listing/error.ejs",{err});
  console.log(err);
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