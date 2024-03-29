import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import { CrudRepository } from "../../repositories/index.js";
import { JWT_SECRET } from "../../config/server-config.js";
import Counter from "../../models/counter.js";
import { BOOK_ID_START, USER_ID_START } from "../../constants/index.js";
import { XetraService, BookService, VillageService } from "../index.js";

class UserService extends CrudRepository {
  constructor() {
    super(User);
  }

  async register(userData, currUser) {
    try {
      const bookService = new BookService();
      const xetraService = new XetraService();
      const villageService = new VillageService();

      let [aggResult] = await User.aggregate([
        {
          $unwind: "$books", // Unwind the books array
        },
        {
          $group: {
            _id: null,
            minBookID_from: { $min: "$books.bookID_from" }, // Find the minimum bookID_from
            maxBookID_from: { $max: "$books.bookID_from" }, // Find the maximum bookID_from
            minBookID_to: { $min: "$books.bookID_to" }, // Find the minimum bookID_to
            maxBookID_to: { $max: "$books.bookID_to" }, // Find the maximum bookID_to
          },
        },
      ]);

      if (userData.role === "IT Nirikshak") {
        const xetraExists = await xetraService.getXetraByName(
          userData.xetraName
        );
        if (!xetraExists) {
          throw new Error("Xetra does not exist");
        }
        userData.xetra = xetraExists._id;
        userData.xetras = [];
        userData.xetras.push(xetraExists._id);
        delete userData.xetraName;
      } else if (userData.role === "Sevak") {
        const xetraExists = await xetraService.getXetraByName(
          userData.xetra_name
        );
        if (!xetraExists) {
          throw new Error("Xetra does not exist");
        }
        userData.xetra = xetraExists._id;

        const villageExists = await villageService.getVillageByName(
          userData.village_name
        );
        if (!villageExists) {
          throw new Error("Village does not exist");
        }
        userData.village = villageExists._id;

        const loggedInUser = await this.getLoggedInUser(currUser);
        // if it's IT Nirikshak, we need to check if selected xetra is under them
        if (loggedInUser.role === "IT Nirikshak") {
          const isXetraUnderUser = await this.isXetraUnderUser(
            loggedInUser.userID,
            userData.xetra
          );
          if (!isXetraUnderUser) {
            throw new Error("Selected Xetra is not under the current user");
          }
        }

        // if selceted village is under the selected xetra
        const isVillageUnderXetra = await xetraService.isVillageUnderXetra(
          userData.xetra_name,
          userData.village_name
        );
        if (!isVillageUnderXetra) {
          throw new Error("Selected Village does not belong to selected Xetra");
        }
      }

      const next_book_id = await bookService.getNextSequenceByID("bookID");
      if (!aggResult) {
        aggResult = {
          minBookID_from: BOOK_ID_START,
          maxBookID_to:
            next_book_id === null ? BOOK_ID_START : next_book_id - 1,
        };
      }
      if (
        userData.from_bookID >= aggResult.minBookID_from &&
        userData.to_bookID <
          (next_book_id === null ? BOOK_ID_START : next_book_id)
      ) {
        userData.books = [];
        userData.books.push({
          bookID_from: userData.from_bookID,
          bookID_to: userData.to_bookID,
        });
      } else {
        throw new Error("Invalid Range");
      }

      let user, counter;
      const session = await Counter.startSession();
      await session.withTransaction(async () => {
        if ((await Counter.findOne({ id: "userID" })) !== null) {
          counter = await Counter.findOneAndUpdate(
            { id: "userID" },
            { $inc: { seq: 1 } },
            { new: true }
          )
            .session(session)
            .exec();
        } else {
          counter = await Counter.create(
            [{ id: "userID", seq: USER_ID_START }],
            { session: session }
          );
          counter = counter.filter((c) => c.id === "userID")[0];
        }
        user = await User.create(
          [
            {
              ...userData,
              userID: counter.seq,
            },
          ],
          { session: session }
        );
        if (userData.role === "IT Nirikshak") {
          // Assign books to user and xetra
          await bookService.assignToUserIT(
            user[0]._id,
            userData.from_bookID,
            userData.to_bookID
          );
          await xetraService.assignBooksToXetra(
            userData.xetra,
            userData.from_bookID,
            userData.to_bookID
          );
        } else if (userData.role === "Sevak") {
          // Assign books to sevak
          await bookService.assignToSevak(
            user[0]._id,
            userData.from_bookID,
            userData.to_bookID
          );
        }
      });
      await session.endSession();
      return user[0];
    } catch (error) {
      console.error(`Error at user service layer: ${error}`);
      throw error;
    }
  }

  async getUserByUserID(userID) {
    try {
      const user = await User.findOne({ userID });
      return user;
    } catch (error) {
      console.error(`Error at user service layer: ${error}`);
      throw error;
    }
  }

  signIn(user) {
    try {
      const token = jwt.sign(
        { userID: user.userID, id: user._id, role: user.role },
        JWT_SECRET,
        {
          expiresIn: "5h",
        }
      );
      return token;
    } catch (error) {
      console.error(`Error at user service layer: ${error}`);
      throw error;
    }
  }

  async getLoggedInUser(user) {
    try {
      const foundUser = await User.findById(user.id)
        .select("userID -_id role")
        .exec();
      return foundUser;
    } catch (error) {
      console.error(`Error at user service layer: ${error}`);
      throw error;
    }
  }

  async isAlreadyAllocatedBooks(from, to) {
    try {
      const user = await User.findOne({
        books: {
          $elemMatch: {
            bookID_from: { $lte: to }, // Check if bookID_from is less than or equal to bookID_to
            bookID_to: { $gte: from }, // Check if bookID_to is greater than or equal to bookID_from
          },
        },
      });
      return user;
    } catch (error) {
      console.error(`Error at user service layer: ${error}`);
      throw error;
    }
  }

  async isAlreadyAllocatedBooksToSevak(from, to) {
    try {
      const user = await User.findOne({
        books: {
          $elemMatch: {
            bookID_from: { $lte: to }, // Check if bookID_from is less than or equal to bookID_to
            bookID_to: { $gte: from }, // Check if bookID_to is greater than or equal to bookID_from
          },
        },
        role: "Sevak",
      });
      return user;
    } catch (error) {
      console.error(`Error at user service layer: ${error}`);
      throw error;
    }
  }

  async isXetraUnderUser(userID, xetra) {
    try {
      const user = await User.findOne({ userID });
      if (!user) {
        throw new Error("User does not exist");
      }

      if (Array.isArray(user.xetras)) {
        let ans = user.xetras.filter((x) => x.equals(xetra));
        return ans.length > 0;
      } else {
        throw new Error("No xetras under this user");
      }
    } catch (error) {
      console.error(`Error at user service layer: ${error}`);
      throw error;
    }
  }
}

export default UserService;
