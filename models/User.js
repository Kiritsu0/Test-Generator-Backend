const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const questionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  question: { type: String, required: true },
  correct_answer: { type: String, required: true },
  incorrect_answers: { type: [String], required: true },
});

const testSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate the test with a user
  questions: { type: [questionSchema], required: true },
  savedAt: { type: Date, default: Date.now }, // Timestamp for when the test is saved
  manualTest: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Test = mongoose.model("Test", testSchema);
const User = mongoose.model("User", userSchema);
module.exports = { Test, User };
