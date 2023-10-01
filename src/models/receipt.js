import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
    {
        receiptID: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
        },
        yajman: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Yajman',
            required: true
        },
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        },
        donation_amount: {
            type: Number,
            enum: [250, 500, 1000, 2500, 5000, 11000, 25000, 51000],
            required: true
        },
        donation_amount_in_words: {
            type: String,
        },
        payment_method: {
            enum: ['Cash', 'Cheque', 'Online'],
            required: true
        },
        payment_status: {
            enum: ['Fulfilled', 'Pending', 'Cancelled'],
            default: 'Pending',
            required: true
        }
    },
    {timestamps: true}
);

const Receipt = mongoose.model("receipt", receiptSchema);

export default Receipt;