import mongoose from "mongoose"

const searchRequestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  itemType: { type: String, enum: ["lost", "found"], required: true },
  location: { type: String, required: true },
  color: { type: String, required: false },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["active", "found", "resolved"], default: "active" },
})

export default mongoose.models.SearchRequest || mongoose.model("SearchRequest", searchRequestSchema)
