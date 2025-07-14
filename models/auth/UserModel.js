const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Schema setup...
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

const createDefaultUser = async () => {
  try {
    const defaultUser = await User.findOne({ username: "Admin Anuj" });
    if (!defaultUser) {
      const user = new User({
        username: "Admin Anuj",
        password: "Admin@123",
      });
      await user.save();
      console.log("Default user created");
    } else {
      console.log("Default user already exists");
    }
  } catch (error) {
    console.error("Error creating default user:", error.message);
  }
};

module.exports = {
  User,
  createDefaultUser,
};
