const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: String,
  date: Date,
  address: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  description: String,
  numberOfSeats: Number,
  //   participantsList: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  //   eventCreator: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
