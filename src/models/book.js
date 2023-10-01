import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        bookID: {
            type: Number,
            required: true,
            unique: true,
            trim: true,
        },
        totalReceipts: {
            type: Number,
            required: true,
            trim: true,
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        status: {
            type: String,
            enum: ['Filled', 'Pending'],
            default: 'Pending',
            required: true
        },
        year: {
            type: String,
            required: true,
            trim: true,
            minLength: 4
        },
        date_of_annakut: {
            type: Date,
            required: true,
            validate: {
                validator: function (v) {
                  return (
                    v && // check that there is a date object
                    v.getTime() > Date.now() + 24 * 60 * 60 * 1000
                )},
                message: "An event must be at least 1 day from now.",
            }
        }
    },
    {timestamps: true}
);

bookSchema.index({userID: 1}, {unique: true});

const Book = mongoose.model("book", bookSchema);

export default Book;