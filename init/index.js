const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


async function main() {
  await mongoose.connect(process.env.ATLASDB_URI);
}

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a2698639e4187562b123536",
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
