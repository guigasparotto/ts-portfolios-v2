import mongoose, { ConnectionOptions } from "mongoose";
import config from "../config";

// const db: string = config.get("mongoURI");

const connectDB = async () => {
    const options: ConnectionOptions = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }

    const mongoURI: string = `mongodb+srv://${config.MONGO_USERNAME}:${config.MONGO_PASSWORD}@portfolios.nmeqf.mongodb.net/${config.MONGO_DATABASE}?retryWrites=true&w=majority`;

    try {
        await mongoose.connect(mongoURI, options);
        console.log("MongoDB connected...");
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}

export default connectDB;
