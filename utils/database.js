import mongoose from 'mongoose';

let isConnected = false;

export const connectedToDB = async () => {
    mongoose.set('strictQuery', true)

    if (isConnected) {
        console.log("MongoDB Connected Bitch!!!")
        return;
    }

    try {
        await mongoose.connect(process.env.mongoDB_URL, {
            dbName: "next_prompto",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        isConnected=true;

        console.log("Successfully Connected to DB");
    }
    catch (error) {
        console.log(error);
    }
}