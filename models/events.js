const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: String,
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  date: Date,
  address: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
  description: String,
<<<<<<< HEAD
  numberOfSeats: Number,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
=======
  seats: Number,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
>>>>>>> 6199bfccb217f7f2415d0c8c9e5dcf16989d0c6b
});

const Event = mongoose.model("events", eventSchema);

module.exports = Event;
