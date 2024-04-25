const mongoose = require("mongoose");

const gpseventSchema = mongoose.Schema({
  date: Date,
  latitude: Number,
  longitude: Number,
  description: String,
  seats: Number,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const Gpsevent = mongoose.model("gpsevents", gpseventSchema);

module.exports = Gpsevent;
