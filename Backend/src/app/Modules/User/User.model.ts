import { model, Schema } from "mongoose";
import { TUser } from "./User.interface";
import config from "../../config";
import bcrypt from 'bcryptjs';

const userSchema = new Schema<TUser>(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      phone: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        default: "Ujjal123",
        select:0
      },
      passwordChangedAt:{
        type: Date,
      },
      needsPasswordChange: {
        type: Boolean,
        default: true,
      },
      role: {
        type: String,
        enum: ['editor', 'admin'],
        default:'editor'
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    },
  );

  userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    // hashing password and save into DB
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bycrypt_salt_round),
    );
    next();
  });

  userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
  });
  

  export const User = model<TUser>('User', userSchema);