import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import { DB_NAME } from "../constants.js";

dotenv.config();

// Helper to hash password (matching auth.controller.js)
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

const seedAdmin = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Connected to Database...");

        const email = "admin@skillswap.com";
        const password = "admin123";
        const username = "admin_super";

        // Check if admin exists
        let admin = await User.findOne({ email });

        if (admin) {
            console.log("Admin user already exists. Updating credentials...");
            admin.password = await hashPassword(password);
            admin.role = "admin";
            await admin.save();
        } else {
            console.log("Creating new Admin user...");
            admin = await User.create({
                name: "Super Admin",
                email,
                username,
                password: await hashPassword(password),
                role: "admin",
                picture: "https://ui-avatars.com/api/?name=Super+Admin&background=0D8ABC&color=fff",
                skillsProficientAt: [{ name: "Administration", proficiency: "Expert" }], // Required field
                skillsToLearn: [{ name: "Everything", proficiency: "Beginner" }], // Required field
            });
        }

        console.log("Admin User Configured Successfully:");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

seedAdmin();
