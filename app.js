const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");


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

//we need session for user authentication so we use passport after session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  //passport has user data in req.user if not logged in its `undefined` else it gives an object\
  //we can use this to check whether user is logged in or not

  // console.log(res.locals.success)
  next();
})


// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"real-student"
//   });

//  let registeredUser= await User.register(fakeUser,"helloworld");
//  res.send(registeredUser);

// })



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);//here the /listing/:id stays in this so we cant acess it in review route file to do that we need external  
app.use("/",userRouter);



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