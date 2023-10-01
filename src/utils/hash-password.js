import bcrypt from "bcrypt";
import { SALT_ROUNDS } from "../config/server-config.js";

export const hashPassword = async (passwordRaw) => { 
    const salt = await bcrypt.genSalt(parseInt(SALT_ROUNDS));
    const passwordHashed = await bcrypt.hash(passwordRaw, salt);
    return passwordHashed
}