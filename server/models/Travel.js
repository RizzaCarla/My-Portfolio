import { Schema, model } from "mongoose";

const travelSchema = new Schema({
  location: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    trim: true
  },
  landmark: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  companions: [{
    type: String,
    trim: true
  }],
  photo: {
    type: String,
    default: ''
  },
  photoDateTaken: {
    type: Date
  },
  lat: {
    type: Number
  },
  lng: {
    type: Number
  },
  isCurrentlyTraveling: {
    type: Boolean,
    default: false
  },
  currentTravelStatus: {
    type: String,
    enum: ['planning', 'traveling', 'arrived', 'completed'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
travelSchema.index({ startDate: -1 });
travelSchema.index({ location: 1 });
travelSchema.index({ country: 1 });

export default model('Travel', travelSchema);