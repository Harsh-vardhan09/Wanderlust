const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controller/listings.js");

router
  .route("/")
  .get(wrapAsync(listingController.index)) //show all listings
  .post(//new listing
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.createListing),
  );

//new route
router.get("/new", isLoggedIn, listingController.renderNew);


router
  .route("/:id")
  .get(wrapAsync(listingController.showListings)) //show listing route
  .put( //update route
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  //deleter route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


//Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm),
);

module.exports = router;
