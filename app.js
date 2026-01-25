const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema}=require("./models/Schema.js");
const Review=require("./models/review.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

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
  // res.send("root is working");
  // res.render("listing/hero.ejs");
  res.redirect("/listings")
  
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
      let errMsg=error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

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
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listing/index.ejs", { allListing });
  }),
);


//new route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});


//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
  }),
);

//create route
app.post(
  "/listings",validateListing,
  wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);

//Edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  }),
);


//Update route
app.put(
  "/listings/:id",validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
  }),
);


//Delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);


//REVIEWS
//POST Route
app.post("/listings/:id/reviews",async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
});


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
