const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    trim: true,
  },
  mobileNumber: {
    type: String,
    trim: true,
  },
  googleOAuth: {
    type: String,
    trim: true,
  },
  activationCode: {
    type: String,
    trim: true,
  },
  isActivated: {
    type: Boolean,
    default: false,
  },
});

userSchema.method({
  token() {
    const secret = "internship-project";

    const payload = {
      sub: this._id,
      email: this.email,
      name: this.name,
      username: this.username,
    };
    return jwt.sign(payload, secret);
  },

  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
});

userSchema.statics = {
  /**
   * Get user
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let user;

      if (mongoose.Types.ObjectId.isValid(id)) {
        user = await this.findById(id).exec();
      }

      if (user) {
        return user;
      }

      throw new APIError({
        message: "User does not exist",
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  async updatePassword(user, newPassword) {
    const rounds = 12;
    const hash = await bcrypt.hash(newPassword, rounds);
    newPassword = hash;
    return user.updateOne({ password: newPassword });
  },

  // async generateActivationCode()

  async generateAccessToken(loggedUser) {
    const { _id } = loggedUser;
    console.log(loggedUser, "UserId");
    const user = await this.findOne({ _id });
    console.log(user, "user");
    let token = user.token();
    return { user, accessToken: token };
  },
};

/**
 * @typedef User
 */
module.exports = mongoose.model("User", userSchema);
