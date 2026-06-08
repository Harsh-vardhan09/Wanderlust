if(process.env.NODE_ENV!="production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL

async function main() {
  await mongoose.connect(dbUrl);
}

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log("server is running at port 8080");
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store= MongoStore.default.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24*60*60,//It controls how often an existing session is updated (“touched”) in MongoDB, even if the session data hasn’t changed.
});

store.on("error",()=>{
  console.log("Error in Mongo session store",err)
});

const sessionsOptions={
   store,
   secret:process.env.SECRET,
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