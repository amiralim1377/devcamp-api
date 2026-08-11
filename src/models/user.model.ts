import bcrypt from "bcryptjs";
import mongoose, { Model, model, Schema, Types } from "mongoose";
import crypto from "crypto";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role: "student" | "instructor" | "admin";
  active?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  passwordChangedAt?: Date;
}

export interface IUserMethods {
  correctPassword(
    candidatePassword: string,
    userPassword: string,
  ): Promise<boolean>;

  createPasswordResetToken(): string;

  changedPasswordAfter(JWTTimestamp: number): boolean;
}

const userSchema = new Schema<IUser, IUserMethods>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Please provide your email!"],
    unique: true,
    lowercase: true,
    trim: true,
  },

  role: {
    type: String,
    enum: ["student", "instructor", "admin"],
    default: "student",
  },

  password: {
    type: String,
    required: [true, "Please provide a password!"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],

    validate: {
      validator: function (this: IUser, el: string) {
        return el === this.password;
      },

      message: "Passwords are not the same!",
    },
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },

  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordChangedAt: Date,
});

userSchema.set("toJSON", {
  transform: function (doc, ret: any) {
    delete ret.password;
    delete ret.passwordConfirm;
    return ret;
  },
});

userSchema.pre("save", async function () {
  //نکن و عملیات ذخیره را ادامه بده HASH اگر رمز عبور تغییر نکرده،دوباره
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (this: any) {
  if (!this.isModified("password") || this.isNew) return;

  this.passwordChangedAt = new Date(Date.now() - 1000);
});

userSchema.pre(/^find/ as any, function (this: mongoose.Query<any, any>) {
  this.find({ active: { $ne: false } });
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = model<IUser, Model<IUser, {}, IUserMethods>>("User", userSchema);

export default User;
