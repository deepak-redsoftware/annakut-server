import mongoose from "mongoose";

const xetraSchema = new mongoose.Schema(
    {
        xetraID: {
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
        villages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Village'
            }
        ],
        description: {
            type: String,
            maxLength: 300,
        },
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
    },
    {timestamps: true}
);

const Xetra = mongoose.model("xetra", xetraSchema);

export default Xetra;