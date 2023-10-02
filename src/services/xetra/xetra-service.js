import { XETRA_ID_START } from "../../constants/index.js";
import Counter from "../../models/counter.js";
import Xetra from "../../models/xetra.js";
import CrudRepository from "../../repositories/crud-repository.js";

class XetraService extends CrudRepository {
  constructor() {
    super(Xetra);
  }

  async createXetra(xetraData) {
    try {
      const existingXetra = await Xetra.findOne({ name: xetraData.name });
      if (existingXetra) {
        throw new Error("Xetra with same name already exists");
      }

      let xetra, counter;
      const session = await Counter.startSession();
      await session.withTransaction(async () => {
        if ((await Counter.findOne({ id: "xetraID" })) !== null) {
          counter = await Counter.findOneAndUpdate(
            { id: "xetraID" },
            { $inc: { seq: 1 } },
            { new: true }
          )
            .session(session)
            .exec();
        } else {
          counter = await Counter.create(
            [{ id: "xetraID", seq: XETRA_ID_START }],
            { session: session }
          );
          counter = counter.filter((c) => c.id === "xetraID")[0];
        }
        xetra = await Xetra.create(
          [
            {
              ...xetraData,
              xetraID: counter.seq,
            },
          ],
          { session: session }
        );
      });
      await session.endSession();
      return xetra[0];
    } catch (error) {
      console.error(`Error at xetra service layer: ${error}`);
      throw error;
    }
  }

  async getXetraByName(name) {
    try {
      const xetra = await Xetra.findOne({ name });
      return xetra;
    } catch (error) {
      console.error(`Error at xetra service layer: ${error}`);
      throw error;
    }
  }

  // async isAlreadyAllocatedBooks(from, to) {
  //   try {
  //     const xetra = await Xetra.findOne({
  //       books: {
  //         $elemMatch: {
  //           bookID_from: { $lte: to }, // Check if bookID_from is less than or equal to bookID_to
  //           bookID_to: { $gte: from }, // Check if bookID_to is greater than or equal to bookID_from
  //         },
  //       },
  //     });
  //     return xetra;
  //   } catch (error) {
  //     console.error(`Error at xetra service layer: ${error}`);
  //     throw error;
  //   }
  // }

  async assignBooksToXetra(xetraId, from, to) {
    try {
      // const alreadyAllocatedToXetra = await this.isAlreadyAllocatedBooks(
      //   from,
      //   to
      // );
      // if (alreadyAllocatedToXetra) {
      //   throw new Error("This range is already allocated to an existing Xetra");
      // }

      const xetra = await Xetra.findOne({ _id: xetraId });
      if (xetra) {
        xetra.books.push({
          bookID_from: from,
          bookID_to: to,
        });
        await xetra.save();
      }
      return xetra;
    } catch (error) {
      console.error(`Error at xetra service layer: ${error}`);
      throw error;
    }
  }
}

export default XetraService;
