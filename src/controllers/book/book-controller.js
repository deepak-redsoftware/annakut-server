import { BOOK_ID_START } from "../../constants/index.js";
import asyncHandler from "../../middlewares/async-handler.js";
import { CounterService, BookService } from "../../services/index.js";
import compareDates from "../../utils/compare-dates.js";

const bookService = new BookService();
const counterService = new CounterService();

const createMasterBooks = asyncHandler(async (req, res) => {
  const { totalReceipts, year, date_of_annakut, from_bookID, to_bookID } =
    req.body;

  if (!totalReceipts || totalReceipts <= 0) {
    res.status(400);
    throw new Error("Book Pages must be a positive and non-zero number");
  }

  if (!year || +year < new Date().getFullYear()) {
    res.status(400);
    throw new Error(
      "Year must be in format YYYY and either current year or greater"
    );
  }

  if (
    !date_of_annakut ||
    !compareDates(
      new Date(date_of_annakut).getTime(),
      Date.now() + 24 * 60 * 60 * 1000
    )
  ) {
    res.status(400);
    throw new Error(
      "Date of Annakut is required and must be at least 1 day from now"
    );
  }

  let from_bookID_next = await counterService.getSequenceByID("bookID");
  if (!from_bookID_next) {
    from_bookID_next = BOOK_ID_START;
  } else {
    from_bookID_next = from_bookID_next.seq + 1;
  }

  if (
    !from_bookID ||
    !to_bookID ||
    +from_bookID <= 0 ||
    +to_bookID <= 0 ||
    +from_bookID !== +from_bookID_next ||
    +from_bookID > +to_bookID
  ) {
    res.status(400);
    throw new Error(
      "From BookID & To BookID are required, From BookID must be next in sequence and To BookID must be greater than From BookID"
    );
  }

  const createdBooks = await bookService.allocateMasterBooks({
    totalReceipts: +totalReceipts,
    year: +year,
    date_of_annakut,
    from_bookID: +from_bookID,
    to_bookID: +to_bookID,
    user_id: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: createdBooks,
  });
});

export { createMasterBooks };
