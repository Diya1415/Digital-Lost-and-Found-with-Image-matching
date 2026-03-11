import mongoose from "mongoose"

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  itemType: { type: String, enum: ["lost", "found"], required: true },
  location: { type: String, required: true },
  color: { type: String, required: false },
  condition: { type: String, required: false },
  image: { type: String, required: true },
  embedding: { type: [Number], required: true },
  visualFeatures: {
    colors: [String],
    objects: [String],
    patterns: [String],
    dominantColor: String,
  },
  uploadedAt: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  userName: { type: String, required: false },
  userEmail: { type: String, required: false },
  matched: { type: Boolean, default: false },
  matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: "Item", default: null },
})

export default mongoose.models.Item || mongoose.model("Item", itemSchema)
