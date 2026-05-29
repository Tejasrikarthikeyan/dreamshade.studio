const router = require("express").Router();
const Product = require("../models/Product");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Get all products / artworks
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artworks" });
  }
});

// Add product / artwork (Admin only)
router.post("/", auth, upload.single('imageFile'), async (req, res) => {
  try {
    let imageUrl = req.body.image;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!imageUrl) {
      return res.status(400).json({ error: "Image file or URL is required" });
    }

    const product = new Product({
      name: req.body.name,
      image: imageUrl,
      description: req.body.description,
      category: req.body.category,
      year: req.body.year || '2026'
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error saving artwork:", error);
    res.status(500).json({ error: "Failed to add artwork" });
  }
});

// Delete product / artwork (Admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Artwork not found" });
    res.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete artwork" });
  }
});

module.exports = router;