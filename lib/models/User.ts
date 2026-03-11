import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: false },
  location: { type: String, required: false },
  lostItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  foundItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
  searchRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "SearchRequest" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model("User", userSchema)
