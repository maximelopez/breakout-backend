const mongoose = require("mongoose");

const gpseventSchema = mongoose.Schema({
  date: Date,
  latitude: Number,
  longitude: Number,
  description: String,
  seats: Number,
});

const Gpsevent = mongoose.model("gpsevents", gpseventSchema);

module.exports = Gpsevent;
