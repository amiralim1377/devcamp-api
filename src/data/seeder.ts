import fs from "fs";
import mongoose from "mongoose";
import { Bootcamp } from "../models/bootcamp.model.js";
import { Course } from "../models/course.model.js";

const bootcamps = JSON.parse(
  fs.readFileSync("./src/data/bootcamps.json", "utf-8"),
);
const courses = JSON.parse(fs.readFileSync("./src/data/courses.json", "utf-8"));

// تابع ایمپورت داده‌ها
const importData = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_LOCAL as string);
    console.log("🌱 Database Connected...");

    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log("✅ Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_LOCAL as string);
    console.log("🌱 Database Connected...");

    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("🗑️ Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
