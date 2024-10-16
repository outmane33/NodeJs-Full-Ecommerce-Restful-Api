const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: String,
    profileImage: String,
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetExpires: Date,
    passwordResetVerified: Boolean,
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    adresses: [
      {
        id: { type: mongoose.Schema.Types.ObjectId },
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // If the user's password has not been modified, skip this middleware
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;

  next();
});

const setImageUrl = (doc) => {
  if (doc.profileImage) {
    const imageUrl = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = imageUrl;
  }
};

userSchema.post("save", function (doc) {
  setImageUrl(doc);
});

userSchema.post("init", function (doc) {
  setImageUrl(doc);
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
