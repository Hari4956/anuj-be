const { User } = require('../../models/auth/UserModel');
const createJwt = require('../../utils/jwt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, password } = req.body;

  console.log("Request Data:", { username, password }); // ✅ Log incoming data

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    createJwt(res, user);
    // ✅ Generate JWT Token
  } catch (error) {
    console.error("❌ Error in login:", error.message);
    res.status(500).json({ message: error.message });
  }
};
const userProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error in user profile:", error.message);
    res.status(500).json({ message: error.message });
  }
}
const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error("❌ Error in logout:", error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { login, logout, userProfile };