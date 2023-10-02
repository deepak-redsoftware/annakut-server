import { VillageService } from "../../services/index.js";
import asyncHandler from "../../middlewares/async-handler.js";

const villageService = new VillageService();

const createVillage = asyncHandler(async (req, res) => {
  const { xetraName, name, description } = req.body;

  if (!name?.trim() || !xetraName?.trim()) {
    res.status(400);
    throw new Error("Village name and xetraId is required");
  }

  const creatorObj = { name: name.trim(), xetraName: xetraName.trim() };

  if (description) {
    creatorObj.description = description;
  }

  const village = await villageService.createVillage(creatorObj);

  if (village) {
    res.status(201).json({
      status: "success",
      data: {
        name: village.name,
        villageID: village.villageID,
        xetraName: village.xetraName,
      },
    });
  } else {
    throw new Error("Invalid village data");
  }
});

export { createVillage };
