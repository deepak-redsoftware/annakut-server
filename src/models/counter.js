import mongoose from "mongoose";

const counterSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            enum: ['userID', 'bookID', 'xetraID', 'villageID', 'receiptID', 'yajmanID'],
            required: true
        },
        seq: {
            type: Number,
            required: true
        }
    },
    {timestamps: true}
);

const Counter = mongoose.model("counter", counterSchema);

export default Counter;