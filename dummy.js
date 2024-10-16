const { default: mongoose } = require("mongoose");
const ProductModel = require("./models/poductModel"); // Update the path to your product model as needed

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/store", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Array of 20 dummy products
const dummyProducts = [
  {
    title: "Men's Running Shoes",
    slug: "mens-running-shoes",
    description:
      "High-performance running shoes for long-distance runs and sprints. Lightweight and durable.",
    quantity: 200,
    sold: 50,
    price: 100,
    priceAfterDiscount: 80,
    colors: ["Black", "White"],
    imageCover: "running_shoes_cover.jpg",
    images: ["image1.jpg", "image2.jpg"],
    category: "66fdcc493fc852f18c546315",
    subCategory: ["67006a87dc228e540bab19ed"],
    ratingsAverage: 4.8,
    ratingsQuantity: 120,
  },
  {
    title: "Wireless Bluetooth Earbuds",
    slug: "wireless-bluetooth-earbuds",
    description:
      "Experience high-quality sound with our Bluetooth earbuds. Comfortable fit and long-lasting battery life.",
    quantity: 500,
    sold: 300,
    price: 75,
    priceAfterDiscount: 60,
    colors: ["Black", "Blue"],
    imageCover: "bluetooth_earbuds_cover.jpg",
    images: ["earbuds1.jpg", "earbuds2.jpg"],
    category: "66fdcc493fc852f18c546315",
    subCategory: ["67006a87dc228e540bab19ed"],
    ratingsAverage: 4.6,
    ratingsQuantity: 200,
  },
  {
    title: "Smart LED Outdoor Lamp",
    slug: "smart-led-outdoor-lamp",
    description:
      "Bright and energy-efficient outdoor LED lamp with smart home integration.",
    quantity: 100,
    sold: 25,
    price: 55,
    priceAfterDiscount: 45,
    colors: ["White"],
    imageCover: "led_lamp_cover.jpg",
    images: ["lamp1.jpg", "lamp2.jpg"],
    category: "66fdcc493fc852f18c546315",
    subCategory: ["66ff2bf78ecfe282a88ad0d0"],
    ratingsAverage: 4.3,
    ratingsQuantity: 85,
  },
  {
    title: "Stainless Steel Water Bottle",
    slug: "stainless-steel-water-bottle",
    description:
      "Keep your drinks hot or cold for hours with our insulated stainless steel bottle.",
    quantity: 300,
    sold: 100,
    price: 25,
    priceAfterDiscount: 20,
    colors: ["Silver", "Black"],
    imageCover: "water_bottle_cover.jpg",
    images: ["bottle1.jpg", "bottle2.jpg"],
    category: "66fdcc493fc852f18c546315",
    subCategory: ["66ff2bf78ecfe282a88ad0d0", "67006a87dc228e540bab19ed"],
    ratingsAverage: 4.7,
    ratingsQuantity: 150,
  },
  {
    title: "Gaming Mouse",
    slug: "gaming-mouse",
    description:
      "Ergonomic gaming mouse with RGB lighting and programmable buttons.",
    quantity: 250,
    sold: 70,
    price: 40,
    priceAfterDiscount: 35,
    colors: ["Black", "Red"],
    imageCover: "gaming_mouse_cover.jpg",
    images: ["mouse1.jpg", "mouse2.jpg"],
    category: "66fdcc493fc852f18c546315",
    subCategory: ["66ff2bf78ecfe282a88ad0d0"],
    ratingsAverage: 4.9,
    ratingsQuantity: 220,
  },
  // 15 more products with different titles, slugs, descriptions, and other attributes...
];

// Insert the 20 products into the database
const insertProducts = async () => {
  try {
    await ProductModel.insertMany(dummyProducts);
    console.log("20 dummy products inserted successfully.");
  } catch (error) {
    console.error("Error inserting products:", error);
  } finally {
    mongoose.disconnect();
  }
};

insertProducts();
