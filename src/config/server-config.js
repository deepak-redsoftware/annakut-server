import dotenv from 'dotenv';
dotenv.config();

const PORT =  process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const SALT_ROUNDS = process.env.SALT_ROUNDS;
const NODE_ENV = process.env.NODE_ENV;
const JWT_SECRET = process.env.JWT_SECRET;

export {
    PORT,
    MONGO_URI,
    SALT_ROUNDS,
    NODE_ENV,
    JWT_SECRET
}