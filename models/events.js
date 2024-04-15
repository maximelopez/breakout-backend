const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: String,
  date: Date,
  address: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'categories'},
  description: String,
  numberOfSeats: Number,
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
