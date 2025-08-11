import { Schema, model } from "mongoose";

const ArtworkSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['painting', 'ceramic', 'embroidery'],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true
});

const Artwork = model("artwork", ArtworkSchema);

export default Artwork;