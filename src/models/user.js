import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/hash-password.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    userID: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      maxLength: 50,
    },
    mobile_number: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['Admin', 'IT Nirikshak', 'Sevak'],
      default: 'Sevak'
    },
    sevaks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    books: [
      {
        bookID_from: {
          type: Number,
        },
        bookID_to: {
          type: Number,
        },
      }
    ],
    xetra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Xetra'
    },
    xetras: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Xetra'
      }
    ],
    village: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Village'
    },
    security_question: {
        type: String,
        enum: ['What was your first school name?', 'What was your first friend\'s name?', 'What is your favourite color?']
    },
    security_answer: {
        type: String,
        default: null
    },
    total_donation_collected: {
      type: Number,
    },
    amount_deposited_to_temple: {
      type: Number,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await hashPassword(this.password);
});

const User = mongoose.model("user", userSchema);

export default User;
