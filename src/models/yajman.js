import mongoose from "mongoose";

const yajmanSchema = new mongoose.Schema(
    {
        yajmanID: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            maxLength: 200,
        },
        sevak: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        mobile_number: {
            type: String,
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
        receipt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Receipt',
            required: true
        },
        village: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Village'
        }
    },
    {timestamps: true}
);

const Yajman = mongoose.model("yajman", yajmanSchema);

export default Yajman;