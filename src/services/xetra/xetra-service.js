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
}

export default XetraService;
