const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide product title"],
      trim: true,
      maxlength: [100, "Product title can not be more than 32 characters"],
      minlength: [3, "Product title can not be less than 3 characters"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
      minlength: [3, "Description can not be less than 20 characters"],
      maxlength: [2000, "Description can not be more than 2000 characters"],
    },
    quantity: {
      type: Number,
      default: 0,
      required: [true, "Please provide product quantity"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
      trim: true,
      min: [20, "Product price can not be more than 20 characters"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Please provide product cover image"],
    },
    images: [],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    //enable vertual updates
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
//mongoose query middleware
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

const setImageUrl = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    doc.images = doc.images.map((image) => {
      const imageUrl = `${process.env.BASE_URL}/products/${image}`;
      return imageUrl;
    });
  }
};

//findOne, findAll
productSchema.post("init", function (doc) {
  setImageUrl(doc);
});
//create
productSchema.post("save", function (doc) {
  setImageUrl(doc);
});

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
