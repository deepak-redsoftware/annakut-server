import asyncHandler from "../../middlewares/async-handler.js";
import { XetraService } from "../../services/index.js";

const xetraService = new XetraService();

// @desc    Create a new Xetra
// @route   POST /xetra
// @access  Protected
const createXetra = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name?.trim()) {
    res.status(400);
    throw new Error("Xetra name is required");
  }

  const creatorObj = { name: name.trim() };

  if (description) {
    creatorObj.description = description;
  }

  const xetra = await xetraService.createXetra(creatorObj);

  if (xetra) {
    res.status(201).json({
      status: "success",
      data: {
        name: xetra.name,
        xetraID: xetra.xetraID,
      },
    });
  } else {
    throw new Error("Invalid xetra data");
  }
});

export { createXetra };
