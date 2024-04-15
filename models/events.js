const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: String,
  date: Date,
  address: String,
  category: String,
  description: String,
  numberOfSeats: Number,
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
