const router = require("express").Router();
const About = require("../models/About");
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

// Get About Page details
router.get("/", async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About();
      await about.save();
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch about data" });
  }
});

// Update About Page details (Admin only)
router.put("/", auth, upload.single('imageFile'), async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About();
    }

    about.title = req.body.title || about.title;
    about.bio1 = req.body.bio1 || about.bio1;
    about.bio2 = req.body.bio2 || about.bio2;

    if (req.file) {
      about.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      about.image = req.body.image;
    }

    await about.save();
    res.json(about);
  } catch (error) {
    console.error("Error updating about details:", error);
    res.status(500).json({ error: "Failed to update about details" });
  }
});

module.exports = router;
