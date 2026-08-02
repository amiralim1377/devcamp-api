import fs from "fs";
import { Bootcamp } from "../models/bootcamp.model.js";
import { Course } from "../models/course.model.js";

const bootcamps = JSON.parse(
  fs.readFileSync("./_data/bootcamps.json", "utf-8"),
);
const courses = JSON.parse(fs.readFileSync("./_data/courses.json", "utf-8"));

// تابع ایمپورت داده‌ها
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log("✅ Data Imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// تابع پاک کردن داده‌ها
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("🗑️ Data Destroyed...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// گرفتن دستور از ترمینال
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
