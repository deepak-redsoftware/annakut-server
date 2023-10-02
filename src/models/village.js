import mongoose from "mongoose";

const villageSchema = new mongoose.Schema(
  {
    villageID: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 300,
    },
    xetra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Xetra",
      required: true,
    },
  },
  { timestamps: true }
);

const Village = mongoose.model("village", villageSchema);

export default Village;
