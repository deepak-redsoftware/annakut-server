import { VILLAGE_ID_START } from "../../constants/index.js";
import Counter from "../../models/counter.js";
import Village from "../../models/village.js";
import { CrudRepository } from "../../repositories/index.js";
import XetraService from "../xetra/xetra-service.js";

const xetraService = new XetraService();

class VillageService extends CrudRepository {
  constructor() {
    super(Village);
  }

  async createVillage(villageData) {
    try {
      const xetraExists = await xetraService.getXetraByName(
        villageData.xetraName
      );
      if (!xetraExists) {
        throw new Error("Xetra does not exist");
      }
      let village, counter;
      const session = await Counter.startSession();
      await session.withTransaction(async () => {
        if ((await Counter.findOne({ id: "villageID" })) !== null) {
          counter = await Counter.findOneAndUpdate(
            { id: "villageID" },
            { $inc: { seq: 1 } },
            { new: true }
          )
            .session(session)
            .exec();
        } else {
          counter = await Counter.create(
            [{ id: "villageID", seq: VILLAGE_ID_START }],
            { session: session }
          );
          counter = counter.filter((c) => c.id === "villageID")[0];
        }
        village = await Village.create(
          [
            {
              ...villageData,
              villageID: counter.seq,
              xetra: xetraExists._id,
            },
          ],
          { session: session }
        );
      });
      await session.endSession();
      return village[0];
    } catch (error) {
      console.error(`Error at village service layer: ${error}`);
      throw error;
    }
  }
}

export default VillageService;
