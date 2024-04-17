const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  date: Date,
  address: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  description: String,
  seats: Number,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
