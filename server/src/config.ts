import dotenv from "dotenv";
import path from "path";

dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
});

export default {
    MONGO_DATABASE: process.env.MONGO_DATABASE || "ContactKeeper",
    MONGO_USERNAME: process.env.MONGO_USERNAME,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET,
};
