const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  title: { type: String, default: 'About dreamshade.studio' },
  bio1: { type: String, default: "Welcome to dreamshade.studio. I am an independent artist specializing in pencil sketches, vibrant color portraits, and unique doodle art. With a passion for capturing emotions and telling stories through art, I've spent years honing my craft." },
  bio2: { type: String, default: "Whether you're looking for a personalized custom drawing to immortalize a memory or searching for a unique piece from my collection, my goal is to bring your vision to life with meticulous attention to detail." },
  image: { type: String, default: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
});

module.exports = mongoose.model("About", aboutSchema);
