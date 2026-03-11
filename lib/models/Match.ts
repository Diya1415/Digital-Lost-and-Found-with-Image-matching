import mongoose from "mongoose"

const matchSchema = new mongoose.Schema({
  lostItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  foundItem: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  similarity: { type: Number, required: true },
  notified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Match || mongoose.model("Match", matchSchema)
