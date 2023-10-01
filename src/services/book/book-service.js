import { BOOK_ID_START } from '../../constants/index.js';
import Book from '../../models/book.js';
import Counter from '../../models/counter.js';
import CrudRepository from '../../repositories/crud-repository.js';

class BookService extends CrudRepository {
    constructor() {
        super(Book);
    }

    async allocateMasterBooks(bookData) {
        try {
            // const fromBookExists = await Book.findOne({bookID: bookData.from_bookID});
            // if (fromBookExists) {
            //     throw new Error(`Book with ID ${bookData.from_bookID} already exists!`);
            // }

            const books = [];
            for (let i = bookData.from_bookID; i <= bookData.to_bookID; i++) {
                books.push({
                    bookID: i,
                    totalReceipts: bookData.totalReceipts,
                    year: bookData.year,
                    date_of_annakut: new Date(bookData.date_of_annakut).getTime()
                });
            }
            const session = await Counter.startSession();
            let counter, insertedBooks;
            await session.withTransaction(async () => {
                if (await Counter.findOne({ id: 'bookID' }) === null) {
                    await Counter.create([{ id: 'bookID', seq: BOOK_ID_START}], { session: session });
                }
                counter = await Counter.findOneAndUpdate({ id: 'bookID' }, {"$inc": {"seq": bookData.from_bookID === BOOK_ID_START ? bookData.to_bookID - bookData.from_bookID : bookData.to_bookID - bookData.from_bookID + 1}}, {new: true}).session(session).exec();
                insertedBooks = await Book.insertMany([...books], { session: session, validateBeforeSave: true });
            });
            await session.endSession();
            return {
                counter,
                insertedBooks
            };
        } catch (error) {
            console.error(`Error at book service layer: ${error}`);
            throw error;
        }
    }
}

export default BookService;