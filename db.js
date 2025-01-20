import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Conexión a MongoDB exitosa", process.env.MONGODB);
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
