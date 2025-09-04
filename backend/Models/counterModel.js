const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1596 },
})


module.exports = mongoose.model("Counter",CounterSchema)