import mongoose, { Schema } from "mongoose";

interface IUser {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true, // => esto elimina los espacios en blanco al principio y al final
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true, // => esto hace que el email sea unico
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
