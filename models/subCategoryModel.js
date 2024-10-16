const { default: mongoose } = require("mongoose");

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      unique: true,
      maxlength: [32, "Sub category can not be more than 32 characters"],
      minlength: [2, "Sub category can not be less than 3 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Sub category must belong to a category"],
    },
  },
  { timestamps: true }
);

const SubCategoryModel = mongoose.model("SubCategory", subCategorySchema);
module.exports = SubCategoryModel;
