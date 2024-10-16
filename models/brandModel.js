const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide brand name"],
      unique: true,
      maxlength: [32, "brand can not be more than 32 characters"],
      minlength: [2, "brand can not be less than 2 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
    doc.image = imageUrl;
  }
};

//findOne, findAll
brandSchema.post("init", function (doc) {
  setImageUrl(doc);
});
//create
brandSchema.post("save", function (doc) {
  setImageUrl(doc);
});

const BrandModel = mongoose.model("Brand", brandSchema);
module.exports = BrandModel;
