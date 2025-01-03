import { USER_ROLE } from "./User.constant"

export interface TUser {
  email: string;
  name: string;
  phone: string;
  password: string;
  passwordChangedAt?:Date;
  needsPasswordChange: boolean;
  role: 'admin' | 'editor';
  isDeleted: boolean;
};

export type TUserRole = keyof typeof USER_ROLE;