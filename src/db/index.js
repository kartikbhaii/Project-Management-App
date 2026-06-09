import mongoose from "mongoose";
import dns from "dns";

// Configure DNS fallback to handle querySrv ECONNREFUSED issues in certain environments/ISPs

// to connect with mongodb atlas, without these try catch and dns server, will not able to connect with mongodb atlas.
try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (error) {
    console.warn("⚠️ DNS configuration warning: could not set custom DNS servers.", error.message);
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`✅MongoDB successfully connected!`)
    } catch (error) {
        console.error("❌MongoDB connection error!", error)
        process.exit(1)
    }
}

export default connectDB;