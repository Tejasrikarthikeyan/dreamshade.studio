require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    // Check if admin exists
    const existing = await User.findOne({ email: 'admin@dreamshade.studio' });
    const hash = await bcrypt.hash('admin123', 10);

    if (existing) {
      existing.password = hash;
      await existing.save();
      console.log('Admin password reset successfully! Email: admin@dreamshade.studio, Pass: admin123');
      process.exit(0);
    }
    const admin = new User({
      email: 'admin@dreamshade.studio',
      password: hash
    });

    await admin.save();
    console.log('Admin seeded successfully! Email: admin@dreamshade.studio, Pass: admin123');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();
