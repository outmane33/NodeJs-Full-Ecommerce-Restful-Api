const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide category name"],
      unique: true,
      maxlength: [32, "Category can not be more than 32 characters"],
      minlength: [3, "Category can not be less than 3 characters"],
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
    const imageUrl = `${process.env.BASE_URL}/categories/${doc.image}`;
    doc.image = imageUrl;
  }
};

//findOne, findAll
categorySchema.post("init", function (doc) {
  setImageUrl(doc);
});
//create
categorySchema.post("save", function (doc) {
  setImageUrl(doc);
});

const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
