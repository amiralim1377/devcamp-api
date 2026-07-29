import { model, Schema, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  passwordConfirm?: string;
  role: "student" | "instructor" | "admin";
}

const userSchema = new Schema<IUser>({
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
});

const User = model<IUser>("User", userSchema);

export default User;
