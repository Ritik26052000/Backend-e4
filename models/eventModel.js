const { mongoose } = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: String,
  data: String,
  capacity: Number,
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ticketPrice: Number,
  dynamicPricing: Boolean,
  ratings: [Number],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
