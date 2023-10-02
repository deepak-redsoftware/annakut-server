import User from "../../models/user.js";
import jwt from "jsonwebtoken";
import { CrudRepository } from "../../repositories/index.js";
import { JWT_SECRET } from "../../config/server-config.js";
import Counter from "../../models/counter.js";
import { USER_ID_START } from "../../constants/index.js";

class UserService extends CrudRepository {
  constructor() {
    super(User);
  }

  async register(userData) {
    try {
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
              name: userData.name,
              userID: counter.seq,
              password: userData.password,
              mobile_number: userData.mobile_number,
              role: userData.role,
            },
          ],
          { session: session }
        );
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
}

export default UserService;
