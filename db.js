import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.BD_DEV);
        console.log("Conexión a MongoDB exitosa", process.env.BD_DEV);
    } catch (error) {
        console.error("Error de conexión a MongoDB:", error);
        process.exit(1);
    }
};

export default connectDB;
